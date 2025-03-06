"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  DumbbellIcon,
  Link,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import type { Workout, WorkoutItem } from "@/lib/types";
import { getWorkouts } from "@/lib/storage";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutItems, setWorkoutItems] = useState<{
    [key: string]: WorkoutItem[];
  }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const fetchedWorkouts = await getWorkouts();
      const items: { [key: string]: WorkoutItem[] } = {};

      // Fetch items for each workout and store them
      for (const workout of fetchedWorkouts) {
        try {
          const workoutItems = await workout.items();
          items[workout.id] = workoutItems.data;
          console.log(items);
        } catch (error) {
          console.error(
            `Error fetching items for workout ${workout.id}:`,
            error
          );
          items[workout.id] = [];
        }
      }

      setWorkoutItems(items);
      setWorkouts(fetchedWorkouts);
      setLoading(false);
    };
    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading workout history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Workout History</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push(`/create`)}
        >
          <PlusIcon className="h-4 w-4" />
          New Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <DumbbellIcon className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No workouts yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first workout to start tracking your fitness journey
          </p>
          <Button onClick={() => router.push(`/create`)}>Create Workout</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{workout.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                    {formatDate(workout.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {workout.items.length}{" "}
                      {workout.items.length === 1 ? "exercise" : "exercises"}
                    </p>
                    <ul className="text-sm space-y-1">
                      {workoutItems[workout.id].slice(0, 3).map((item) => (
                        <li key={item.id} className="truncate">
                          • {item.name} ({item.repeats} reps, {item.weight} kg)
                        </li>
                      ))}
                      {workoutItems[workout.id].length > 3 && (
                        <li className="text-muted-foreground">
                          + {workout.items.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => router.push(`/workout/${workout.id}`)}
                  >
                    View Details
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
