export interface KbChunk {
  id: string;
  topic: string;
  source: string;
  text: string;
}

export interface EmbeddedChunk extends KbChunk {
  vector: number[];
}

export interface RetrievedChunk extends KbChunk {
  score: number;
}
