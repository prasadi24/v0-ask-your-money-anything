"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Star,
  Target,
  Flame,
  Crown,
  Zap,
  Calendar,
  TrendingUp,
  BookOpen,
  Brain,
  PieChart,
  Users,
  Share2,
} from "lucide-react"

const achievementCategories = [
  {
    id: "learning",
    name: "Learning Milestones",
    icon: BookOpen,
    color: "bg-blue-500",
    achievements: [
      {
        id: "first-lesson",
        name: "First Steps",
        description: "Complete your first learning module",
        points: 10,
        rarity: "Common",
        earned: true,
        earnedDate: "2024-01-15",
        icon: Star,
      },
      {
        id: "knowledge-seeker",
        name: "Knowledge Seeker",
        description: "Complete 10 learning modules",
        points: 100,
        rarity: "Uncommon",
        earned: true,
        earnedDate: "2024-02-20",
        icon: BookOpen,
      },
      {
        id: "scholar",
        name: "Financial Scholar",
        description: "Complete 50 learning modules",
        points: 500,
        rarity: "Rare",
        earned: false,
        progress: 23,
        total: 50,
        icon: Crown,
      },
    ],
  },
  {
    id: "quiz",
    name: "Quiz Master",
    icon: Brain,
    color: "bg-green-500",
    achievements: [
      {
        id: "quiz-novice",
        name: "Quiz Novice",
        description: "Score 70%+ on your first quiz",
        points: 25,
        rarity: "Common",
        earned: true,
        earnedDate: "2024-01-18",
        icon: Brain,
      },
      {
        id: "quiz-expert",
        name: "Quiz Expert",
        description: "Score 90%+ on 5 different quizzes",
        points: 150,
        rarity: "Rare",
        earned: true,
        earnedDate: "2024-03-10",
        icon: Trophy,
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Get 100% on any quiz",
        points: 200,
        rarity: "Epic",
        earned: false,
        icon: Star,
      },
    ],
  },
  {
    id: "streak",
    name: "Consistency",
    icon: Flame,
    color: "bg-orange-500",
    achievements: [
      {
        id: "week-warrior",
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        points: 75,
        rarity: "Uncommon",
        earned: true,
        earnedDate: "2024-02-05",
        icon: Flame,
      },
      {
        id: "month-master",
        name: "Month Master",
        description: "Maintain a 30-day learning streak",
        points: 300,
        rarity: "Epic",
        earned: false,
        progress: 12,
        total: 30,
        icon: Calendar,
      },
      {
        id: "year-legend",
        name: "Year Legend",
        description: "Maintain a 365-day learning streak",
        points: 1000,
        rarity: "Legendary",
        earned: false,
        progress: 12,
        total: 365,
        icon: Crown,
      },
    ],
  },
  {
    id: "investment",
    name: "Investment Pro",
    icon: TrendingUp,
    color: "bg-purple-500",
    achievements: [
      {
        id: "first-investment",
        name: "First Investment",
        description: "Make your first simulated investment",
        points: 50,
        rarity: "Common",
        earned: true,
        earnedDate: "2024-01-25",
        icon: TrendingUp,
      },
      {
        id: "portfolio-builder",
        name: "Portfolio Builder",
        description: "Create a diversified portfolio with 5+ assets",
        points: 200,
        rarity: "Rare",
        earned: false,
        icon: PieChart,
      },
      {
        id: "profit-master",
        name: "Profit Master",
        description: "Achieve 20%+ returns in simulation",
        points: 400,
        rarity: "Epic",
        earned: false,
        icon: Target,
      },
    ],
  },
  {
    id: "social",
    name: "Community",
    icon: Users,
    color: "bg-pink-500",
    achievements: [
      {
        id: "helpful-member",
        name: "Helpful Member",
        description: "Help 5 other users with their questions",
        points: 100,
        rarity: "Uncommon",
        earned: false,
        icon: Users,
      },
      {
        id: "knowledge-sharer",
        name: "Knowledge Sharer",
        description: "Share 10 learning achievements",
        points: 150,
        rarity: "Rare",
        earned: false,
        progress: 3,
        total: 10,
        icon: Share2,
      },
    ],
  },
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

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case "Epic":
      return "shadow-lg shadow-purple-200"
    case "Legendary":
      return "shadow-lg shadow-orange-200"
    case "Mythic":
      return "shadow-lg shadow-red-200"
    default:
      return ""
  }
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const totalAchievements = achievementCategories.reduce((sum, cat) => sum + cat.achievements.length, 0)
  const earnedAchievements = achievementCategories.reduce(
    (sum, cat) => sum + cat.achievements.filter((a) => a.earned).length,
    0,
  )
  const totalPoints = achievementCategories.reduce(
    (sum, cat) => sum + cat.achievements.filter((a) => a.earned).reduce((pts, a) => pts + a.points, 0),
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-artha-50 via-white to-navy-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-800 mb-4">🏆 Achievement Gallery</h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Celebrate your financial learning journey with badges and milestones
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-artha-500 to-artha-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-artha-100" />
              <div className="text-3xl font-bold mb-2">
                {earnedAchievements}/{totalAchievements}
              </div>
              <div className="text-artha-100">Achievements Unlocked</div>
              <Progress value={(earnedAchievements / totalAchievements) * 100} className="mt-3 h-2 bg-artha-400" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-purple-100" />
              <div className="text-3xl font-bold mb-2">{totalPoints}</div>
              <div className="text-purple-100">Achievement Points</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-orange-100" />
              <div className="text-3xl font-bold mb-2">Gold</div>
              <div className="text-orange-100">Achievement Tier</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
            <TabsTrigger value="streak">Streaks</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {achievementCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span>{category.name}</span>
                    <Badge variant="outline">
                      {category.achievements.filter((a) => a.earned).length}/{category.achievements.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.achievements.map((achievement) => {
                      const IconComponent = achievement.icon
                      return (
                        <Card
                          key={achievement.id}
                          className={`relative transition-all hover:scale-105 ${
                            achievement.earned
                              ? `bg-gradient-to-br from-artha-50 to-navy-50 border-artha-200 ${getRarityGlow(achievement.rarity)}`
                              : "bg-gray-50 border-gray-200 opacity-75"
                          }`}
                        >
                          <CardContent className="p-4 text-center">
                            <div
                              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                                achievement.earned ? getRarityColor(achievement.rarity) : "bg-gray-400"
                              } text-white relative`}
                            >
                              <IconComponent className="h-8 w-8" />
                              {achievement.earned && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Zap className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>

                            <h4 className="font-semibold mb-1">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <Badge
                                variant="outline"
                                className={`${achievement.earned ? getRarityColor(achievement.rarity) : "bg-gray-400"} text-white border-0`}
                              >
                                {achievement.rarity}
                              </Badge>
                              <Badge variant="secondary">+{achievement.points} pts</Badge>
                            </div>

                            {achievement.earned ? (
                              <div className="text-xs text-green-600 font-medium">
                                ✓ Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                              </div>
                            ) : achievement.progress !== undefined ? (
                              <div className="space-y-2">
                                <div className="text-xs text-gray-600">
                                  Progress: {achievement.progress}/{achievement.total}
                                </div>
                                <Progress value={(achievement.progress / achievement.total!) * 100} className="h-2" />
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">Not earned yet</div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {achievementCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span>{category.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Master {category.name.toLowerCase()} to unlock these exclusive achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.achievements.map((achievement) => {
                      const IconComponent = achievement.icon
                      return (
                        <Card
                          key={achievement.id}
                          className={`relative transition-all hover:scale-105 ${
                            achievement.earned
                              ? `bg-gradient-to-br from-artha-50 to-navy-50 border-artha-200 ${getRarityGlow(achievement.rarity)}`
                              : "bg-gray-50 border-gray-200 opacity-75"
                          }`}
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                                achievement.earned ? getRarityColor(achievement.rarity) : "bg-gray-400"
                              } text-white relative`}
                            >
                              <IconComponent className="h-10 w-10" />
                              {achievement.earned && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <Zap className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>

                            <h4 className="font-bold text-lg mb-2">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

                            <div className="flex items-center justify-center space-x-2 mb-4">
                              <Badge
                                variant="outline"
                                className={`${achievement.earned ? getRarityColor(achievement.rarity) : "bg-gray-400"} text-white border-0`}
                              >
                                {achievement.rarity}
                              </Badge>
                              <Badge variant="secondary" className="bg-artha-100 text-artha-700">
                                +{achievement.points} points
                              </Badge>
                            </div>

                            {achievement.earned ? (
                              <div className="space-y-2">
                                <div className="text-sm text-green-600 font-medium">✓ Achievement Unlocked!</div>
                                <div className="text-xs text-gray-600">
                                  Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
                                </div>
                                <Button size="sm" variant="outline" className="mt-2">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            ) : achievement.progress !== undefined ? (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                  Progress: {achievement.progress}/{achievement.total}
                                </div>
                                <Progress value={(achievement.progress / achievement.total!) * 100} className="h-3" />
                                <div className="text-xs text-gray-500">
                                  {achievement.total! - achievement.progress} more to go!
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">Start your journey to unlock this achievement</div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
