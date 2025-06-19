import { type NextRequest, NextResponse } from "next/server"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  points: number
}

const questionBank: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the full form of SIP in mutual funds?",
    options: [
      "Systematic Investment Plan",
      "Strategic Investment Portfolio",
      "Structured Investment Program",
      "Standard Investment Policy",
    ],
    correct: 0,
    explanation:
      "SIP stands for Systematic Investment Plan, which allows you to invest a fixed amount regularly in mutual funds.",
    difficulty: "Easy",
    category: "Mutual Funds",
    points: 10,
  },
  {
    id: 2,
    question: "What is the current rate of GST on gold in India?",
    options: ["3%", "5%", "12%", "18%"],
    correct: 0,
    explanation: "GST on gold is currently 3% in India, making it one of the lower GST rates.",
    difficulty: "Medium",
    category: "Taxation",
    points: 20,
  },
  {
    id: 3,
    question: "Which of the following is NOT a type of mutual fund based on asset allocation?",
    options: ["Equity Fund", "Debt Fund", "Hybrid Fund", "Currency Fund"],
    correct: 3,
    explanation:
      "Currency funds are not a standard mutual fund category based on asset allocation. The main types are Equity, Debt, and Hybrid funds.",
    difficulty: "Hard",
    category: "Mutual Funds",
    points: 30,
  },
  {
    id: 4,
    question: "What is the lock-in period for ELSS mutual funds?",
    options: ["1 year", "2 years", "3 years", "5 years"],
    correct: 2,
    explanation: "ELSS (Equity Linked Savings Scheme) mutual funds have a mandatory lock-in period of 3 years.",
    difficulty: "Medium",
    category: "Tax Saving",
    points: 20,
  },
  {
    id: 5,
    question: "Which Indian stock exchange is older?",
    options: ["NSE", "BSE", "Both started together", "MCX"],
    correct: 1,
    explanation:
      "BSE (Bombay Stock Exchange) was established in 1875, making it much older than NSE which was established in 1992.",
    difficulty: "Easy",
    category: "Stock Market",
    points: 10,
  },
  {
    id: 6,
    question: "What is the maximum amount you can invest in PPF per year?",
    options: ["₹1,00,000", "₹1,50,000", "₹2,00,000", "₹2,50,000"],
    correct: 1,
    explanation: "The maximum amount you can invest in PPF (Public Provident Fund) is ₹1,50,000 per financial year.",
    difficulty: "Easy",
    category: "Tax Saving",
    points: 10,
  },
  {
    id: 7,
    question: "What does P/E ratio stand for?",
    options: ["Price to Equity", "Price to Earnings", "Profit to Equity", "Profit to Earnings"],
    correct: 1,
    explanation:
      "P/E ratio stands for Price to Earnings ratio, which compares a company's share price to its earnings per share.",
    difficulty: "Medium",
    category: "Stock Market",
    points: 20,
  },
  {
    id: 8,
    question: "Which of these is considered the safest investment option?",
    options: ["Equity Mutual Funds", "Government Bonds", "Cryptocurrency", "Penny Stocks"],
    correct: 1,
    explanation:
      "Government bonds are considered the safest investment option as they are backed by the government's guarantee.",
    difficulty: "Easy",
    category: "Investment Basics",
    points: 10,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get("difficulty")
  const category = searchParams.get("category")
  const count = Number.parseInt(searchParams.get("count") || "5")

  let filteredQuestions = questionBank

  if (difficulty) {
    filteredQuestions = filteredQuestions.filter((q) => q.difficulty === difficulty)
  }

  if (category) {
    filteredQuestions = filteredQuestions.filter((q) => q.category === category)
  }

  // Shuffle and select random questions
  const shuffled = filteredQuestions.sort(() => 0.5 - Math.random())
  const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length))

  return NextResponse.json({
    questions: selectedQuestions,
    total: selectedQuestions.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { answers, questionIds } = await request.json()

    // Calculate score
    let score = 0
    let totalPoints = 0
    const results = []

    for (let i = 0; i < questionIds.length; i++) {
      const question = questionBank.find((q) => q.id === questionIds[i])
      if (question) {
        const isCorrect = answers[i] === question.correct
        if (isCorrect) {
          score++
          totalPoints += question.points
        }

        results.push({
          questionId: question.id,
          correct: isCorrect,
          userAnswer: answers[i],
          correctAnswer: question.correct,
          explanation: question.explanation,
          points: isCorrect ? question.points : 0,
        })
      }
    }

    const percentage = (score / questionIds.length) * 100
    let badge = ""

    if (percentage >= 90) badge = "Expert"
    else if (percentage >= 75) badge = "Advanced"
    else if (percentage >= 60) badge = "Intermediate"
    else badge = "Beginner"

    return NextResponse.json({
      score,
      total: questionIds.length,
      percentage: Math.round(percentage),
      totalPoints,
      badge,
      results,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process quiz results" }, { status: 500 })
  }
}
