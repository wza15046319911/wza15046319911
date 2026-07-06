# UQ Ask Anything - agentic RAG

UQ Ask Anything is a planner-routed agentic RAG service that answers University of Queensland course questions, grounded by design. It runs over Postgres and pgvector with six retrieval modes, from SQL filtering to bge-m3 semantic search and RRF hybrid search.

The design draws a strict boundary between deterministic code and the model. The LLM planner only fills validated filter slots, and SQL is assembled from bound parameters. High-risk enrolment facts such as prerequisites and fees come from deterministic code, never from the model. An answerability gate refuses to answer when evidence is missing, and answer drafting is citation guarded. The model backend is pluggable across Ollama, DeepSeek, and Bedrock.

This project is the direct inspiration for the chat you are using now: same bge-m3 embeddings, same answerability gate, same deterministic-versus-model discipline.

[[ASK ZANE: what you learned building it; the retrieval mode that mattered most]].
