import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DumbbellIcon, MessageSquareIcon, HistoryIcon } from "lucide-react"
import WorkoutStats from "@/components/workout-stats"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background z-0"></div>
        <div className="container relative z-10 py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Your Personal <span className="text-primary">Workout Assistant</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track your workouts, get fitness advice, and achieve your goals with FitTrack
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Workout
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Chat with Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="container py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Your Workout Stats</h2>
        <WorkoutStats />
      </div>

      {/* Features section */}
      <div className="container py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquareIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Chat Companion</CardTitle>
              <CardDescription>Get workout advice from our AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ask questions about exercises, form, nutrition, and more. Get personalized advice to help you reach your
                fitness goals.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/chat" className="w-full">
                <Button variant="ghost" className="w-full">
                  Chat Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <DumbbellIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create Workout</CardTitle>
              <CardDescription>Plan your next workout session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add exercises, sets, reps, and weights to your workout plan. Create custom workouts tailored to your
                specific needs.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/create" className="w-full">
                <Button variant="ghost" className="w-full">
                  Create Workout
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HistoryIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Workout History</CardTitle>
              <CardDescription>View your previous workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your progress and see how you've improved over time. Review past workouts to inform your future
                training.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/history" className="w-full">
                <Button variant="ghost" className="w-full">
                  View History
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary/5 py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your first workout today and take the first step towards achieving your fitness goals.
            </p>
            <Link href="/create">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

