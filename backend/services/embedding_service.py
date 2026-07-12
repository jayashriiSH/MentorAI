from langchain_huggingface import HuggingFaceEmbeddings

# Load embedding model once
embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-small-en-v1.5"
)


def get_embedding_model():
    """
    Returns the embedding model.
    """
    return embedding_model