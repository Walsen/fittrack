"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, SearchIcon, CheckIcon } from "lucide-react";
import type { Workout, WorkoutItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface WorkoutSelectorProps {
  workouts: Workout[];
  onImportWorkout: (workout: Workout) => void;
  onImportExercises: (exercises: WorkoutItem[]) => void;
}

export default function WorkoutSelector({
  workouts,
  onImportWorkout,
  onImportExercises,
}: WorkoutSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedWorkoutItems, setSelectedWorkoutItems] = useState<
    WorkoutItem[]
  >([]);
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, boolean>
  >({});
  const [open, setOpen] = useState(false); // Updated state variable

  // Filter workouts based on search
  const filteredWorkouts = workouts.filter(async (workout) => {
    const workoutItems = (await workout.items()).data;
    setSelectedWorkoutItems(workoutItems);
    return (
      workout.title.toLowerCase().includes(search.toLowerCase()) ||
      workoutItems.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // Handle workout selection
  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
    // Reset exercise selections when changing workouts
    setSelectedExercises({});
  };

  // Toggle exercise selection
  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  // Import the entire workout
  const handleImportWorkout = () => {
    if (selectedWorkout) {
      onImportWorkout(selectedWorkout);
      setOpen(false); // Updated to close the dialog
      // Reset state
      setSelectedWorkout(null);
      setSelectedExercises({});
      setSearch("");
    }
  };

  // Import only selected exercises
  const handleImportExercises = async () => {
    if (selectedWorkout) {
      const workoutItems = (await selectedWorkout.items()).data;
      setSelectedWorkoutItems(workoutItems);
      const exercisesToImport = workoutItems.filter(
        (item) => selectedExercises[item.id]
      );
      if (exercisesToImport.length > 0) {
        onImportExercises(exercisesToImport);
        setOpen(false); // Updated to close the dialog
        // Reset state
        setSelectedWorkout(null);
        setSelectedExercises({});
        setSearch("");
      }
    }
  };

  // Count selected exercises
  const selectedCount = Object.values(selectedExercises).filter(Boolean).length;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          Browse Previous Workouts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select from Previous Workouts</DialogTitle>
        </DialogHeader>

        <div className="relative my-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts or exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="exercises" disabled={!selectedWorkout}>
              Exercises {selectedWorkout ? `(${selectedWorkout.title})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="mt-4">
            <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
              {filteredWorkouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[100px] text-center">
                  <p className="text-muted-foreground">
                    No matching workouts found
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredWorkouts.map((workout) => (
                    <Card
                      key={workout.id}
                      className={`cursor-pointer hover:bg-accent transition-colors ${
                        selectedWorkout?.id === workout.id
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => handleWorkoutSelect(workout)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              {workout.title}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDate(workout.date)}
                            </div>
                          </div>
                          {selectedWorkout?.id === workout.id && (
                            <CheckIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-0 pb-3 px-4">
                        <p className="text-xs text-muted-foreground">
                          {workout.items.length}{" "}
                          {workout.items.length === 1
                            ? "exercise"
                            : "exercises"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedWorkout && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleImportWorkout}>
                  Import Entire Workout
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="exercises" className="mt-4">
            {selectedWorkout ? (
              <>
                <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
                  <div className="space-y-2">
                    {selectedWorkoutItems.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center space-x-3 p-3 rounded hover:bg-accent"
                      >
                        <Checkbox
                          id={`exercise-${exercise.id}`}
                          checked={!!selectedExercises[exercise.id]}
                          onCheckedChange={() => toggleExercise(exercise.id)}
                        />
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <label
                            htmlFor={`exercise-${exercise.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {exercise.name}
                          </label>
                          <span className="text-sm text-muted-foreground">
                            {exercise.repeats} reps
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {exercise.weight} kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedCount} exercise{selectedCount !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                  <Button
                    onClick={handleImportExercises}
                    disabled={selectedCount === 0}
                  >
                    Import Selected Exercises
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] border rounded-md">
                <p className="text-muted-foreground">Select a workout first</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
