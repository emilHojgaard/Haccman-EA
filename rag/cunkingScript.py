from typing import List
import argparse
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
    parser = argparse.ArgumentParser()
    parser.add_argument("filename", help="Text file to chunk")
    parser.add_argument("--sentences", type=int, default=3, help="Sentences per chunk")
    args = parser.parse_args()

    with open(args.filename, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = sentence_chunker(text, args.sentences)

    for i, chunk in enumerate(chunks, 1):
        print(f"Chunk {i}:\n{chunk}\n")