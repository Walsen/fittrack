"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusIcon,
  TrashIcon,
  DumbbellIcon,
  SaveIcon,
  ArrowLeftIcon,
  Loader2Icon,
} from "lucide-react";
import type { WorkoutItem } from "@/lib/types";
import {
  getWorkoutById,
  updateWorkoutItem,
  updateWorkout,
  saveWorkoutItem,
  deleteWorkoutItem,
} from "@/lib/storage";
import { motion } from "framer-motion";
import { v4 as uuidV4 } from "uuid";

export default function EditWorkout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [, setDate] = useState("");
  const [items, setItems] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workoutId, setWorkoutId] = useState("");
  const [originalItems, setOriginalItems] = useState<WorkoutItem[]>([]);

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setWorkoutId(id);
    };
    resolveParams();
  }, [params]);
  useEffect(() => {
    const fetchWorkoutItems = async () => {
      const fetchedWorkout = await getWorkoutById(workoutId);
      const fetchedWorkoutItems = await fetchedWorkout?.items();
      if (fetchedWorkout) {
        setDate(fetchedWorkout?.date);
        setTitle(fetchedWorkout?.title);
      }
      if (fetchedWorkoutItems) {
        setItems(fetchedWorkoutItems.data);
        setOriginalItems(fetchedWorkoutItems.data);
      }
      setLoading(false);
    };
    fetchWorkoutItems();
  }, [workoutId, router]);

  const addWorkoutItem = () => {
    console.log("addWorkoutItem is called");
    const workoutItem: Partial<WorkoutItem> = {
      id: uuidV4(),
      name: "",
      weight: 0,
      repeats: 0,
    };
    setItems([...items, workoutItem as WorkoutItem]);
  };

  const removeWorkoutItem = (id: string) => {
    console.log("removeWorkoutItem: " + id);
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateLocalWorkoutItem = (
    id: string,
    field: keyof WorkoutItem,
    value: string | number
  ) => {
    console.log("updateLocalWorkoutItem: " + id + " " + field + " " + value);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    console.log("updatedItems: ", updatedItems);
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form
      if (!title.trim()) {
        alert("Please enter a workout title");
        return;
      }

      if (items.some((item) => !item.name.trim())) {
        alert("Please enter a name for all workout items");
        return;
      }

      console.log("handleSubmit");

      // Update the workout title
      await updateWorkout(workoutId, title);

      // Process each workout item
      for (const item of items) {
        const itemWithWorkoutId = {
          ...item,
          workoutId: workoutId,
        };

        // Check if this item existed in the original items
        const existingItem = originalItems.find(
          (originalItem) => originalItem.id === item.id
        );

        if (existingItem) {
          await updateWorkoutItem(item.id, itemWithWorkoutId);
        } else {
          await saveWorkoutItem(itemWithWorkoutId);
        }
      }

      // Handle deleted items
      for (const originalItem of originalItems) {
        const stillExists = items.some((item) => item.id === originalItem.id);
        if (!stillExists) {
          await deleteWorkoutItem(originalItem.id);
        }
      }

      router.push(`/workout/${workoutId}`);
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Error updating workout");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" disabled>
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <Loader2Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading workout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/workout/${workoutId}`}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Workout</h1>
        </div>
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Workout Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="title" className="text-base">
                Workout Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Monday Upper Body"
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addWorkoutItem}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Add Exercise
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <DumbbellIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No exercises added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={addWorkoutItem}
              className="mt-4"
            >
              Add Your First Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Exercise {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWorkoutItem(item.id)}
                        disabled={items.length === 1}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${item.id}`}>Exercise Name</Label>
                        <Input
                          id={`name-${item.id}`}
                          value={item.name}
                          onChange={(e) =>
                            updateLocalWorkoutItem(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Bench Press"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`repeats-${item.id}`}>Repeats</Label>
                        <Input
                          id={`repeats-${item.id}`}
                          type="number"
                          min="0"
                          value={item.repeats}
                          onChange={(e) =>
                            updateLocalWorkoutItem(
                              item.id,
                              "repeats",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g., 12"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${item.id}`}>Weight (kg)</Label>
                        <Input
                          id={`weight-${item.id}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.weight}
                          onChange={(e) =>
                            updateLocalWorkoutItem(
                              item.id,
                              "weight",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="e.g., 60"
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
