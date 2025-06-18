import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Document {
  id: string
  name: string
  type: string
  file_path: string
  size: number
  upload_date: string
  status: "processing" | "processed" | "failed"
  user_id: string
  created_at: string
}

export interface QueryLog {
  id: string
  user_id: string
  question: string
  response: string
  sources: string[]
  timestamp: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  last_login: string
}

// Database operations
export const dbOperations = {
  // Document operations
  async uploadDocument(document: Omit<Document, "id" | "created_at">) {
    const { data, error } = await supabase.from("documents").insert(document).select().single()

    if (error) throw error
    return data
  },

  async getDocuments(userId?: string) {
    let query = supabase.from("documents").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async updateDocumentStatus(id: string, status: Document["status"]) {
    const { data, error } = await supabase.from("documents").update({ status }).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Query log operations
  async logQuery(queryLog: Omit<QueryLog, "id" | "created_at">) {
    const { data, error } = await supabase.from("query_logs").insert(queryLog).select().single()

    if (error) throw error
    return data
  },

  async getQueryLogs(userId?: string, limit = 50) {
    let query = supabase.from("query_logs").select("*").order("created_at", { ascending: false }).limit(limit)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // Analytics
  async getAnalytics() {
    const { data: totalQueries, error: queriesError } = await supabase
      .from("query_logs")
      .select("id", { count: "exact" })

    const { data: totalDocuments, error: docsError } = await supabase.from("documents").select("id", { count: "exact" })

    const { data: totalUsers, error: usersError } = await supabase.from("users").select("id", { count: "exact" })

    if (queriesError || docsError || usersError) {
      throw new Error("Failed to fetch analytics")
    }

    return {
      totalQueries: totalQueries?.length || 0,
      totalDocuments: totalDocuments?.length || 0,
      totalUsers: totalUsers?.length || 0,
    }
  },
}
