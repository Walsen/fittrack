export interface WorkoutItem {
  id: string;
  name: string;
  repeats: number;
  weight: number;
}

export interface Workout {
  id: string;
  title: string;
  date: string;
  items: WorkoutItem[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Type guards
export const isWorkoutItem = (item: unknown): item is WorkoutItem => {
  if (!item || typeof item !== "object") return false;
  const workout = item as Record<string, unknown>;
  return (
    typeof workout.id === "string" &&
    typeof workout.name === "string" &&
    typeof workout.repeats === "number" &&
    typeof workout.weight === "number"
  );
};

export const isWorkout = (workout: unknown): workout is Workout => {
  if (!workout || typeof workout !== "object") return false;
  const w = workout as Record<string, unknown>;
  return (
    typeof w.id === "string" &&
    typeof w.title === "string" &&
    typeof w.date === "string" &&
    Array.isArray(w.items) &&
    w.items.every(isWorkoutItem)
  );
};
