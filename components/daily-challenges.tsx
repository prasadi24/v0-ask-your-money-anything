"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, Trophy, Flame, CheckCircle, Clock, Star, Gift, Zap } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "quiz" | "calculation" | "reading" | "simulation"
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  timeLimit: number // in minutes
  completed: boolean
  category: string
  icon: any
}

const todaysChallenges: Challenge[] = [
  {
    id: "daily-1",
    title: "SIP Calculator Challenge",
    description: "Calculate the future value of a ₹5,000 monthly SIP for 10 years at 12% annual return",
    type: "calculation",
    difficulty: "Easy",
    points: 25,
    timeLimit: 5,
    completed: false,
    category: "Mutual Funds",
    icon: Target,
  },
  {
    id: "daily-2",
    title: "Market News Quiz",
    description: "Answer 3 questions about today's market movements and economic news",
    type: "quiz",
    difficulty: "Medium",
    points: 35,
    timeLimit: 10,
    completed: true,
    category: "Market Knowledge",
    icon: Trophy,
  },
  {
    id: "daily-3",
    title: "Tax Saving Scenario",
    description: "Help Raj optimize his Section 80C investments to save maximum tax",
    type: "simulation",
    difficulty: "Hard",
    points: 50,
    timeLimit: 15,
    completed: false,
    category: "Tax Planning",
    icon: Star,
  },
]

const weeklyChallenge = {
  title: "Portfolio Diversification Master",
  description: "Build a balanced portfolio across 5 asset classes with ₹1,00,000",
  progress: 60,
  totalPoints: 200,
  daysLeft: 3,
  participants: 1247,
}

const achievements = [
  { name: "Daily Warrior", description: "Complete 7 daily challenges", progress: 5, total: 7, icon: Flame },
  { name: "Quiz Master", description: "Score 90%+ on 10 quizzes", progress: 7, total: 10, icon: Trophy },
  { name: "Calculator Pro", description: "Complete 20 calculation challenges", progress: 15, total: 20, icon: Target },
]

export function DailyChallenges() {
  const [streak, setStreak] = useState(7)
  const [todayPoints, setTodayPoints] = useState(35)
  const [totalChallengesCompleted, setTotalChallengesCompleted] = useState(1)

  const handleChallengeComplete = (challengeId: string) => {
    const challenge = todaysChallenges.find((c) => c.id === challengeId)
    if (challenge && !challenge.completed) {
      challenge.completed = true
      setTodayPoints((prev) => prev + challenge.points)
      setTotalChallengesCompleted((prev) => prev + 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-orange-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return Trophy
      case "calculation":
        return Target
      case "reading":
        return Calendar
      case "simulation":
        return Star
      default:
        return Target
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Current Streak</p>
                <p className="text-2xl font-bold">{streak} days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-artha-500 to-artha-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-artha-100">Today's Points</p>
                <p className="text-2xl font-bold">{todayPoints}</p>
              </div>
              <Star className="h-8 w-8 text-artha-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed Today</p>
                <p className="text-2xl font-bold">{totalChallengesCompleted}/3</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Rank</p>
                <p className="text-2xl font-bold">#42</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-artha-600" />
            <span>Today's Challenges</span>
            <Badge variant="outline">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          </CardTitle>
          <CardDescription>Complete daily challenges to maintain your streak and earn points!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todaysChallenges.map((challenge) => {
              const IconComponent = challenge.icon
              return (
                <Card
                  key={challenge.id}
                  className={`relative ${challenge.completed ? "bg-green-50 border-green-200" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getDifficultyColor(challenge.difficulty)} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {challenge.category}
                          </Badge>
                        </div>
                      </div>
                      {challenge.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription className="text-sm">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-600">+{challenge.points} pts</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{challenge.timeLimit}m</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      disabled={challenge.completed}
                      onClick={() => handleChallengeComplete(challenge.id)}
                      variant={challenge.completed ? "secondary" : "default"}
                    >
                      {challenge.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Start Challenge
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenge */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-6 w-6 text-purple-600" />
            <span>Weekly Challenge</span>
            <Badge className="bg-purple-600">{weeklyChallenge.daysLeft} days left</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-purple-800">{weeklyChallenge.title}</h3>
              <p className="text-purple-700">{weeklyChallenge.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>Progress: {weeklyChallenge.progress}%</span>
              <span className="font-medium text-purple-600">+{weeklyChallenge.totalPoints} points</span>
            </div>
            <Progress value={weeklyChallenge.progress} className="h-3" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {weeklyChallenge.participants.toLocaleString()} participants
              </span>
              <Button className="bg-purple-600 hover:bg-purple-700">Continue Challenge</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-artha-600" />
            <span>Achievement Progress</span>
          </CardTitle>
          <CardDescription>Track your progress towards earning special achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              const progress = (achievement.progress / achievement.total) * 100
              return (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="p-2 bg-artha-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-artha-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <span className="text-sm text-gray-600">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
