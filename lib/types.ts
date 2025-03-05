export interface WorkoutItem {
  id: string
  name: string
  repeats: number
  weight: number
}

export interface Workout {
  id: string
  title: string
  date: string
  items: WorkoutItem[]
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

