"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeftIcon,
  CalendarIcon,
  TrashIcon,
  EditIcon,
  DumbbellIcon,
  Loader2Icon,
  BrainIcon,
} from "lucide-react";
import type { Workout, WorkoutItem } from "@/lib/types";
import { getWorkoutById, deleteWorkout } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

const client = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(client);
export default function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutId, setWorkoutId] = useState("");
  const [{ data, isLoading: isReviewLoading }, analyzeTraining] =
    useAIGeneration("analyzeTraining");
  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setWorkoutId(id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const fetchedWorkout = await getWorkoutById(workoutId);
      const fetchedWorkoutItems = await fetchedWorkout?.items();
      if (fetchedWorkout) {
        setWorkout(fetchedWorkout);
      }
      if (fetchedWorkoutItems) {
        setWorkoutItems(fetchedWorkoutItems.data);
      }
      setLoading(false);
    };
    if (workoutId) {
      fetchWorkouts();
    }
  }, [workoutId]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this workout?")) {
      if (workout) {
        deleteWorkout(workout.id);
        router.push("/history");
      }
    }
  };

  const analyzeWorkout = async () => {
    const workoutItemsArray = workoutItems.map(
      (item) => `${item.name}: ${item.repeats} reps at ${item.weight}kg`
    );
    console.log(workoutItemsArray);
    analyzeTraining({ trainings: workoutItemsArray });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center mb-6">
          <Link href="/history">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <Loader2Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading workout details...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-20">
          <DumbbellIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Workout not found</h2>
          <p className="text-muted-foreground mb-6">
            The workout you are looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link href="/history">
            <Button>
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link href="/history">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{workout.title}</h1>
      </div>

      <Card className="mb-8 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Workout Details</CardTitle>
          <CardDescription className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDate(workout.date)}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <Button
          onClick={analyzeWorkout}
          className="flex items-center gap-2 mb-4"
          disabled={isReviewLoading}
        >
          {isReviewLoading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Analyzing Workout...
            </>
          ) : (
            <>
              <BrainIcon className="h-4 w-4" />
              Analyze Workout
            </>
          )}
        </Button>

        {data?.analysis && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Workout Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">
                {data?.analysis}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Exercises</h2>

      <div className="space-y-4 mb-8">
        {workoutItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Exercise</p>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Repeats</p>
                    <p className="font-medium">{item.repeats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{item.weight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Link href={`/edit/${workoutId}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <EditIcon className="h-4 w-4" /> Edit Workout
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="flex items-center gap-2"
        >
          <TrashIcon className="h-4 w-4" /> Delete Workout
        </Button>
      </div>
    </div>
  );
}
