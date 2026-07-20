import json
import uuid
from typing import List, Optional
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage

from app.database import SessionLocal
from app.models.models import Entity
from app.services.llm_service import get_gemini_model

class EntityExtraction(BaseModel):
    entity_type: str
    entity_value: str
    confidence: float
    context: str

class EntityList(BaseModel):
    entities: List[EntityExtraction]

def extract_entities(text: str, document_id: str) -> List[Entity]:
    """
    Extracts entities (Equipment, Failure, Date, Part, Person) from text using LLM.
    """
    llm = get_gemini_model()
    
    if not llm:
        print("[WARNING] Skipping entity extraction because LLM is not configured.")
        return []
        
    system_prompt = (
        "You are an industrial data extraction AI. Read the provided text and extract key entities. "
        "The allowed entity_type values are: 'equipment', 'failure', 'part', 'person', 'date'. "
        "Return the output as a valid JSON object matching this schema: "
        '{"entities": [{"entity_type": "string", "entity_value": "string", "confidence": 0.9, "context": "string surrounding the entity"}]}'
    )
    
    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=text[:15000])  # limit text length for extraction
        ])
        
        # Parse JSON from response
        # Sometimes Gemini wraps JSON in markdown blocks
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        data = json.loads(content)
        
        db = SessionLocal()
        extracted_entities = []
        for item in data.get("entities", []):
            entity = Entity(
                id=str(uuid.uuid4()),
                document_id=document_id,
                entity_type=item.get("entity_type"),
                entity_value=item.get("entity_value"),
                confidence=item.get("confidence", 0.9),
                context=item.get("context", "")
            )
            db.add(entity)
            extracted_entities.append(entity)
            
        db.commit()
        return extracted_entities
        
    except Exception as e:
        print(f"[ERROR] Entity extraction failed: {e}")
        return []
