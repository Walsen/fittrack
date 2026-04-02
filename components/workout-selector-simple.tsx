"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, SearchIcon, CheckIcon } from "lucide-react";
import type { Workout, WorkoutItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ResolvedWorkout extends Omit<Workout, "items"> {
  items: WorkoutItem[];
}

interface WorkoutSelectorProps {
  workouts: ResolvedWorkout[];
  onImportWorkout: (workout: ResolvedWorkout) => void;
  onImportExercises: (exercises: WorkoutItem[]) => void;
}

export default function WorkoutSelectorSimple({
  workouts,
  onImportWorkout,
  onImportExercises,
}: WorkoutSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<ResolvedWorkout | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, boolean>
  >({});
  const [open, setOpen] = useState(false);

  // Filter workouts based on search
  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.title.toLowerCase().includes(search.toLowerCase()) ||
      workout.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Handle workout selection
  const handleWorkoutSelect = (workout: ResolvedWorkout) => {
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
      setOpen(false);
      // Reset state
      setSelectedWorkout(null);
      setSelectedExercises({});
      setSearch("");
    }
  };

  // Import only selected exercises
  const handleImportExercises = () => {
    if (selectedWorkout) {
      const exercisesToImport = selectedWorkout.items.filter(
        (item) => selectedExercises[item.id]
      );
      if (exercisesToImport.length > 0) {
        onImportExercises(exercisesToImport);
        setOpen(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          Browse Previous Workouts
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Select from Previous Workouts</SheetTitle>
          <SheetDescription>
            Import a complete workout or select individual exercises
          </SheetDescription>
        </SheetHeader>

        <div className="relative my-4 p-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground p-4" />
          <Input
            placeholder="Search workouts or exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 p-4"
          />
        </div>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="exercises" disabled={!selectedWorkout}>
              Exercises
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
                    {selectedWorkout.items.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center space-x-3 p-3 rounded hover:bg-accent"
                        onClick={() => toggleExercise(exercise.id)}
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

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
