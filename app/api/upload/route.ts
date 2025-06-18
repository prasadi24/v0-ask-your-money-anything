// Free document upload and processing
import { freeVectorStore } from "@/lib/free-vector-store"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const text = await file.text()

    // Extract metadata
    const metadata = {
      source: file.name,
      type: getDocumentType(file.name),
      size: file.size,
    }

    // Add to vector store
    await freeVectorStore.addDocument(text, metadata)

    return Response.json({
      success: true,
      message: `Document ${file.name} processed successfully`,
      chunks: freeVectorStore.getChunkCount(),
      documents: freeVectorStore.getDocumentCount(),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}

function getDocumentType(filename: string): string {
  const name = filename.toLowerCase()
  if (name.includes("mutual") || name.includes("fund")) return "Mutual Fund"
  if (name.includes("gold") || name.includes("commodity")) return "Commodity"
  if (name.includes("real estate") || name.includes("property")) return "Real Estate"
  if (name.includes("lic") || name.includes("insurance")) return "Insurance"
  return "Financial Document"
}
