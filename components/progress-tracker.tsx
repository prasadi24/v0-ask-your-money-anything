"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Star,
  Award,
  BookOpen,
  Brain,
  Calculator,
  PieChart,
  BarChart3,
  Activity,
} from "lucide-react"

const skillsData = [
  { name: "Basic Finance", level: 85, maxLevel: 100, icon: BookOpen, color: "bg-green-500" },
  { name: "Investment Planning", level: 72, maxLevel: 100, icon: TrendingUp, color: "bg-blue-500" },
  { name: "Tax Planning", level: 60, maxLevel: 100, icon: Calculator, color: "bg-orange-500" },
  { name: "Risk Management", level: 45, maxLevel: 100, icon: Target, color: "bg-red-500" },
  { name: "Portfolio Analysis", level: 38, maxLevel: 100, icon: PieChart, color: "bg-purple-500" },
  { name: "Market Analysis", level: 25, maxLevel: 100, icon: BarChart3, color: "bg-indigo-500" },
]

const learningStats = {
  totalHours: 47,
  modulesCompleted: 23,
  quizzesCompleted: 15,
  simulationsRun: 8,
  averageScore: 78,
  streak: 12,
}

const monthlyProgress = [
  { month: "Jan", points: 450, modules: 3, quizzes: 5 },
  { month: "Feb", points: 680, modules: 5, quizzes: 8 },
  { month: "Mar", points: 920, modules: 7, quizzes: 12 },
  { month: "Apr", points: 1250, modules: 9, quizzes: 15 },
]

const badges = [
  { name: "First Steps", description: "Completed first module", earned: true, rarity: "Common", icon: Star },
  { name: "Quiz Master", description: "Scored 90%+ on 5 quizzes", earned: true, rarity: "Uncommon", icon: Brain },
  { name: "SIP Champion", description: "Mastered SIP calculations", earned: true, rarity: "Rare", icon: Calculator },
  { name: "Portfolio Pro", description: "Built 3 balanced portfolios", earned: false, rarity: "Epic", icon: PieChart },
  {
    name: "Market Guru",
    description: "Predicted 10 market movements",
    earned: false,
    rarity: "Legendary",
    icon: TrendingUp,
  },
  { name: "Tax Ninja", description: "Optimized tax for 5 scenarios", earned: false, rarity: "Mythic", icon: Target },
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return "bg-gray-500"
    case "Uncommon":
      return "bg-green-500"
    case "Rare":
      return "bg-blue-500"
    case "Epic":
      return "bg-purple-500"
    case "Legendary":
      return "bg-orange-500"
    case "Mythic":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function ProgressTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-artha-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-artha-600">{learningStats.totalHours}</div>
            <div className="text-sm text-gray-600">Hours Learned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{learningStats.modulesCompleted}</div>
            <div className="text-sm text-gray-600">Modules Done</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{learningStats.quizzesCompleted}</div>
            <div className="text-sm text-gray-600">Quizzes Passed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{learningStats.simulationsRun}</div>
            <div className="text-sm text-gray-600">Simulations</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{learningStats.averageScore}%</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{learningStats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-artha-600" />
                <span>Skill Development</span>
              </CardTitle>
              <CardDescription>Track your progress across different financial domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsData.map((skill, index) => {
                  const IconComponent = skill.icon
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{skill.name}</h4>
                            <p className="text-sm text-gray-600">Level {Math.floor(skill.level / 10)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            {skill.level}/{skill.maxLevel}
                          </span>
                          <p className="text-sm text-gray-600">{skill.level}% Complete</p>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-3" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-artha-600" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription>Your learning journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {monthlyProgress.map((month, index) => (
                    <Card key={index} className="bg-gradient-to-br from-artha-50 to-navy-50">
                      <CardContent className="p-4 text-center">
                        <h4 className="font-semibold text-lg">{month.month}</h4>
                        <div className="space-y-2 mt-2">
                          <div>
                            <span className="text-2xl font-bold text-artha-600">{month.points}</span>
                            <p className="text-xs text-gray-600">Points</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-semibold">{month.modules}</span>
                              <p className="text-xs text-gray-600">Modules</p>
                            </div>
                            <div>
                              <span className="font-semibold">{month.quizzes}</span>
                              <p className="text-xs text-gray-600">Quizzes</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-artha-600" />
                <span>Achievement Badges</span>
              </CardTitle>
              <CardDescription>Collect badges by completing challenges and reaching milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => {
                  const IconComponent = badge.icon
                  return (
                    <Card
                      key={index}
                      className={`relative ${
                        badge.earned
                          ? "bg-gradient-to-br from-artha-50 to-navy-50 border-artha-200"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                            badge.earned ? getRarityColor(badge.rarity) : "bg-gray-400"
                          } text-white`}
                        >
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <h4 className="font-semibold">{badge.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${badge.earned ? getRarityColor(badge.rarity) : "bg-gray-400"} text-white border-0`}
                        >
                          {badge.rarity}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-artha-600" />
                <span>Leaderboard</span>
              </CardTitle>
              <CardDescription>See how you rank against other learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Priya Sharma", points: 2450, avatar: "PS" },
                  { rank: 2, name: "Rahul Kumar", points: 2380, avatar: "RK" },
                  { rank: 3, name: "Anita Patel", points: 2290, avatar: "AP" },
                  { rank: 42, name: "You", points: 1250, avatar: "YU", isUser: true },
                  { rank: 43, name: "Vikram Singh", points: 1240, avatar: "VS" },
                  { rank: 44, name: "Meera Joshi", points: 1235, avatar: "MJ" },
                ].map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${
                      user.isUser ? "bg-artha-50 border-2 border-artha-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank <= 3 ? "bg-artha-600 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {user.rank <= 3 ? user.rank : user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-navy-600 text-white flex items-center justify-center font-semibold">
                        {user.avatar}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${user.isUser ? "text-artha-700" : ""}`}>{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.points.toLocaleString()} points</p>
                    </div>
                    {user.rank <= 3 && (
                      <Trophy
                        className={`h-6 w-6 ${
                          user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-orange-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
