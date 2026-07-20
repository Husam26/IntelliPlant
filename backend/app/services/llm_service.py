import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import settings

def get_gemini_model():
    """Get the LLM model (Groq Llama-3) initialized with API key."""
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        print("[WARNING] API_KEY is not set or is a placeholder. Using fallback.")
        return None
    return ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key)



def get_faiss_index():
    import os
    from langchain_community.vectorstores import FAISS
    from langchain_community.embeddings import HuggingFaceEmbeddings
    
    embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)
    faiss_path = settings.FAISS_PERSIST_DIR
    
    if os.path.exists(faiss_path) and os.path.exists(os.path.join(faiss_path, "index.faiss")):
        return FAISS.load_local(faiss_path, embeddings, allow_dangerous_deserialization=True)
    return None

def generate_rag_answer(query: str, session_id: str) -> dict:
    """
    RAG Pipeline: Retrieve -> Generate
    """
    # 1. Retrieve relevant chunks from FAISS
    vectorstore = get_faiss_index()
    
    context_parts = []
    citations = []
    
    if vectorstore:
        results = vectorstore.similarity_search(query, k=5)
        for doc in results:
            meta = doc.metadata
            context_parts.append(f"--- Document: {meta.get('filename')} ---\n{doc.page_content}")
            citations.append({
                "document_name": meta.get("filename"),
                "document_id": meta.get("document_id"),
                "page": meta.get("chunk_index"),
                "excerpt": doc.page_content[:150] + "..."  # Short snippet for frontend
            })
            
    context_text = "\n\n".join(context_parts)
    
    # 2. Generate answer using LLM
    llm = get_gemini_model()
    
    if not llm:
        return {
            "answer": "AI integration is not configured. Please set the GEMINI_API_KEY in the .env file.",
            "citations": citations
        }
        
    system_prompt = (
        "You are an AI Copilot for IntelliPlant, an industrial operations platform. "
        "Answer the user's question based strictly on the provided context below. "
        "If the context does not contain the answer, say 'I cannot find the answer in the uploaded documents.' "
        "Be concise, professional, and reference the source documents when appropriate."
        f"\n\nContext Information:\n{context_text}"
    )
    
    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=query)
        ])
        answer = response.content
    except Exception as e:
        print(f"[ERROR] LLM Generation failed: {e}")
        error_str = str(e)
        if "429" in error_str or "Quota exceeded" in error_str:
            answer = "⚠️ **Rate Limit Exceeded:** You are using the Free Tier of the Gemini API and have made too many requests too quickly (processing a document takes several requests). Please wait 1 minute and try asking your question again."
        else:
            answer = "I encountered an error while trying to process your request."
        
    return {
        "answer": answer,
        "citations": citations
    }


def summarize_text(text: str) -> str:
    """Summarize text for document processing."""
    llm = get_gemini_model()
    
    if not llm:
        # Fallback to simple slice if no LLM
        return text[:500] + "..." if len(text) > 500 else text
        
    try:
        prompt = "Provide a concise, 2-3 sentence summary of the following industrial document:\n\n" + text[:10000]
        response = llm.invoke([HumanMessage(content=prompt)])
        return response.content
    except Exception as e:
        print(f"[ERROR] LLM Summarization failed: {e}")
        return text[:500] + "..." if len(text) > 500 else text

import json

def extract_assets_from_text(text: str) -> list[dict]:
    """Extract physical assets, health status, and other details from document text."""
    llm = get_gemini_model()
    if not llm:
        return []
        
    system_prompt = (
        "You are an industrial asset extraction AI. Your task is to identify physical assets (like pumps, compressors, valves) "
        "mentioned in the text and extract their health status, maintenance data, and risk level.\n"
        "Return ONLY a JSON array of objects with the following keys:\n"
        "- name (e.g. 'Pump P-101')\n"
        "- type (e.g. 'Pump', 'Compressor')\n"
        "- health_score (integer 0-100, guess based on text)\n"
        "- status (e.g. 'Critical', 'Warning', 'Healthy')\n"
        "- criticality (e.g. 'High', 'Medium', 'Low')\n"
        "If no assets are found, return an empty array []. Do not include markdown formatting like ```json in the output, just raw JSON."
    )
    
    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=text[:15000])  # limit text length
        ])
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        assets = json.loads(content.strip())
        if isinstance(assets, list):
            return assets
        return []
    except Exception as e:
        print(f"[ERROR] Asset Extraction failed: {e}")
        return []
