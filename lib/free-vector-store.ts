// Free local vector store implementation using browser storage
interface DocumentChunk {
  id: string
  content: string
  embedding: number[]
  metadata: {
    source: string
    page?: number
    type: string
    uploadDate: string
  }
}

export class FreeVectorStore {
  private chunks: DocumentChunk[] = []
  private storageKey = "fingpt_documents"

  constructor() {
    this.loadFromStorage()
  }

  // Simple cosine similarity calculation
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  // Simple text-to-vector conversion (TF-IDF like)
  private textToVector(text: string): number[] {
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2)
    const wordFreq: Record<string, number> = {}

    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    // Create a simple 100-dimensional vector
    const vector = new Array(100).fill(0)
    Object.entries(wordFreq).forEach(([word, freq], index) => {
      const hash = this.simpleHash(word) % 100
      vector[hash] += freq
    })

    return vector
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  async addDocument(content: string, metadata: Omit<DocumentChunk["metadata"], "uploadDate">) {
    // Split content into chunks
    const chunks = this.splitIntoChunks(content, 500)

    chunks.forEach((chunk, index) => {
      const embedding = this.textToVector(chunk)
      const docChunk: DocumentChunk = {
        id: `${Date.now()}_${index}`,
        content: chunk,
        embedding,
        metadata: {
          ...metadata,
          uploadDate: new Date().toISOString(),
        },
      }
      this.chunks.push(docChunk)
    })

    this.saveToStorage()
  }

  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const words = text.split(" ")
    const chunks: string[] = []

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(" "))
    }

    return chunks
  }

  async search(query: string, topK = 5): Promise<DocumentChunk[]> {
    const queryVector = this.textToVector(query)

    const scoredChunks = this.chunks.map((chunk) => ({
      ...chunk,
      score: this.cosineSimilarity(queryVector, chunk.embedding),
    }))

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((chunk) => chunk.score > 0.1) // Minimum similarity threshold
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.chunks = JSON.parse(stored)
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.chunks))
    }
  }

  getDocumentCount(): number {
    return new Set(this.chunks.map((c) => c.metadata.source)).size
  }

  getChunkCount(): number {
    return this.chunks.length
  }

  clearAll() {
    this.chunks = []
    this.saveToStorage()
  }
}

export const freeVectorStore = new FreeVectorStore()
