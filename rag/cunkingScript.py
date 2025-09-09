from typing import List
import re
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize

def sentence_chunker(text: str, sentences_per_chunk: int) -> List[str]:
    # Tokenize text into sentences
    sentences = sent_tokenize(text)
    chunks = []
    
    # Group sentences into chunks
    for i in range(0, len(sentences), sentences_per_chunk):
        chunk_sentences = sentences[i: i + sentences_per_chunk]
        chunk = ' '.join(chunk_sentences)
        chunks.append(chunk)
    
    return chunks

# Example usage
if __name__ == "__main__":
    text = (
        "Machine learning is a subset of artificial intelligence. It focuses on building systems that learn from data and improve over time. "
        "Applications include healthcare, finance, and robotics. Advanced techniques like neural networks are key to its success."
    )
    
    sentences_per_chunk = 1 # Number of sentences per chunk
    
    # Generate sentence-based chunks
    chunks = sentence_chunker(text, sentences_per_chunk)
    
    # Display chunks
    for i, chunk in enumerate(chunks, 1):
        print(f"Chunk {i}:\n{chunk}\n")