from app.services.document_processor import chunk_text

def test_chunk_text():
    """Test that text is chunked correctly with overlap."""
    text = "A" * 1200  # 1200 characters
    chunks = chunk_text(text, chunk_size=500, overlap=100)
    
    assert len(chunks) == 3, f"Expected 3 chunks, got {len(chunks)}"
    assert len(chunks[0]) == 500
    # Overlap means chunk 2 starts at index 400 (500 - 100), ends at 900
    assert len(chunks[1]) == 500
    # Chunk 3 starts at 800 (900 - 100), ends at 1200
    assert len(chunks[2]) == 400

def test_chunk_text_empty():
    """Test chunking handles empty text."""
    chunks = chunk_text("")
    assert chunks == []
