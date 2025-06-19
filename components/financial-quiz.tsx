"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, Trophy, Target, CheckCircle, XCircle, RotateCcw, Zap } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  points: number
}

const sampleQuestions: Question[] = [
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
]

export function FinancialQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, showResult])

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setTotalPoints(0)
    setTimeLeft(30)
    setShowResult(false)
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = () => {
    const answerIndex = Number.parseInt(selectedAnswer) || -1
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (answerIndex === sampleQuestions[currentQuestion].correct) {
      setScore(score + 1)
      setTotalPoints(totalPoints + sampleQuestions[currentQuestion].points)
    }

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setTimeLeft(30)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setTotalPoints(0)
    setTimeLeft(30)
  }

  const getScoreMessage = () => {
    const percentage = (score / sampleQuestions.length) * 100
    if (percentage >= 80) return { message: "🏆 Excellent! You're a finance expert!", color: "text-green-600" }
    if (percentage >= 60) return { message: "👍 Good job! Keep learning!", color: "text-blue-600" }
    if (percentage >= 40) return { message: "📚 Not bad! More practice needed.", color: "text-orange-600" }
    return { message: "💪 Keep studying! You'll improve!", color: "text-red-600" }
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-artha-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-artha-600" />
            </div>
            <CardTitle className="text-2xl">🧠 Financial Quiz Arena</CardTitle>
            <CardDescription>Test your financial knowledge with our interactive quiz system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">5 Questions</h3>
                <p className="text-sm text-gray-600">Mixed difficulty levels</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold">30 Seconds</h3>
                <p className="text-sm text-gray-600">Per question</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Up to 90 Points</h3>
                <p className="text-sm text-gray-600">Based on difficulty</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Quiz Categories:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Mutual Funds</Badge>
                <Badge variant="outline">Stock Market</Badge>
                <Badge variant="outline">Taxation</Badge>
                <Badge variant="outline">Tax Saving</Badge>
                <Badge variant="outline">Banking</Badge>
              </div>
            </div>

            <Button onClick={startQuiz} size="lg" className="bg-artha-600 hover:bg-artha-700">
              <Zap className="h-5 w-5 mr-2" />
              Start Quiz Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResult) {
    const scoreMessage = getScoreMessage()
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-artha-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-artha-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription className={scoreMessage.color}>{scoreMessage.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {score}/{sampleQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((score / sampleQuestions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="p-4 bg-artha-50 rounded-lg">
                  <div className="text-2xl font-bold text-artha-600">{totalPoints}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Review Your Answers:</h4>
              {sampleQuestions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    {answers[index] === question.correct ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-green-600 mt-1">✓ {question.options[question.correct]}</p>
                      {answers[index] !== question.correct && answers[index] !== -1 && (
                        <p className="text-sm text-red-600">✗ Your answer: {question.options[answers[index]]}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>New Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = sampleQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </span>
                <Badge variant="outline">{question.difficulty}</Badge>
                <Badge variant="secondary">{question.category}</Badge>
              </CardTitle>
              <CardDescription>+{question.points} points</CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-artha-600"}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600">Time left</div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{question.question}</div>

          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button onClick={handleNextQuestion} disabled={!selectedAnswer} className="w-full">
            {currentQuestion === sampleQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
