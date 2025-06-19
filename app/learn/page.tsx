"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Calculator,
  Star,
  Flame,
  Award,
  PlayCircle,
  CheckCircle,
  Lock,
} from "lucide-react"
import { FinancialQuiz } from "@/components/financial-quiz"
import { InvestmentSimulator } from "@/components/investment-simulator"
import { DailyChallenges } from "@/components/daily-challenges"
import { ProgressTracker } from "@/components/progress-tracker"

export default function LearnPage() {
  const [userLevel, setUserLevel] = useState("Beginner")
  const [totalPoints, setTotalPoints] = useState(1250)
  const [streak, setStreak] = useState(7)
  const [completedModules, setCompletedModules] = useState(12)

  const learningPaths = [
    {
      id: "basics",
      title: "Financial Basics",
      description: "Master the fundamentals of personal finance",
      level: "Beginner",
      modules: 8,
      completed: 6,
      points: 400,
      icon: BookOpen,
      color: "bg-green-500",
      unlocked: true,
    },
    {
      id: "investing",
      title: "Investment Mastery",
      description: "Learn stocks, mutual funds, and portfolio building",
      level: "Intermediate",
      modules: 12,
      completed: 4,
      points: 600,
      icon: TrendingUp,
      color: "bg-blue-500",
      unlocked: true,
    },
    {
      id: "trading",
      title: "Trading Strategies",
      description: "Advanced trading techniques and analysis",
      level: "Advanced",
      modules: 10,
      completed: 2,
      points: 800,
      icon: Target,
      color: "bg-purple-500",
      unlocked: false,
    },
    {
      id: "tax",
      title: "Tax Optimization",
      description: "Master Indian tax laws and saving strategies",
      level: "Intermediate",
      modules: 6,
      completed: 3,
      points: 300,
      icon: Calculator,
      color: "bg-orange-500",
      unlocked: true,
    },
  ]

  const recentAchievements = [
    { name: "First Quiz Master", description: "Completed your first quiz", icon: Trophy, earned: true },
    { name: "Week Warrior", description: "7-day learning streak", icon: Flame, earned: true },
    { name: "SIP Champion", description: "Mastered SIP calculations", icon: Star, earned: true },
    { name: "Market Master", description: "90%+ on advanced market quiz", icon: Award, earned: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-artha-50 via-white to-navy-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-4">🎓 Financial Learning Hub</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Master finance through interactive lessons, quizzes, and real-world simulations
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-artha-500 to-artha-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-artha-100">Total Points</p>
                  <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
                </div>
                <Trophy className="h-8 w-8 text-artha-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Learning Streak</p>
                  <p className="text-2xl font-bold">{streak} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-2xl font-bold">{completedModules} modules</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Current Level</p>
                  <p className="text-2xl font-bold">{userLevel}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="paths" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Arena</TabsTrigger>
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
            <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className={`relative overflow-hidden ${!path.unlocked ? "opacity-60" : ""}`}>
                  <div className={`absolute top-0 left-0 w-full h-2 ${path.color}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${path.color} text-white`}>
                          <path.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {path.level}
                          </Badge>
                        </div>
                      </div>
                      {!path.unlocked && <Lock className="h-5 w-5 text-gray-400" />}
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {path.completed}/{path.modules} modules
                        </span>
                        <span className="font-medium text-artha-600">+{path.points} points</span>
                      </div>
                      <Progress value={(path.completed / path.modules) * 100} className="h-2" />
                      <Button
                        className="w-full"
                        disabled={!path.unlocked}
                        variant={path.unlocked ? "default" : "secondary"}
                      >
                        {path.unlocked ? (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Unlock with 500 points
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-artha-600" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.earned ? "border-artha-200 bg-artha-50" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="text-center">
                        <achievement.icon
                          className={`h-8 w-8 mx-auto mb-2 ${achievement.earned ? "text-artha-600" : "text-gray-400"}`}
                        />
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <FinancialQuiz />
          </TabsContent>

          <TabsContent value="simulator">
            <InvestmentSimulator />
          </TabsContent>

          <TabsContent value="challenges">
            <DailyChallenges />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
