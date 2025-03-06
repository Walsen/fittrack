import { Schema } from "@/amplify/data/resource";

export type Workout = Schema["Workout"]["type"];
export type WorkoutItem = Schema["WorkoutItem"]["type"];

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
