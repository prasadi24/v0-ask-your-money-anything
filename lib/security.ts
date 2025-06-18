import crypto from "crypto"

export class SecurityManager {
  // Encrypt sensitive data
  static encryptData(data: string, key: string): string {
    const cipher = crypto.createCipher("aes-256-cbc", key)
    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")
    return encrypted
  }

  // Rate limiting for API calls
  static rateLimiter = new Map<string, { count: number; resetTime: number }>()

  static checkRateLimit(userId: string, maxRequests = 100, windowMs = 3600000): boolean {
    const now = Date.now()
    const userLimit = this.rateLimiter.get(userId)

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimiter.set(userId, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (userLimit.count >= maxRequests) {
      return false
    }

    userLimit.count++
    return true
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .trim()
  }
}
