import { v4 as uuidv4 } from "uuid";
import type { Workout, WorkoutItem } from "../types";
import {
  getWorkouts,
  saveWorkout as persistWorkout,
  deleteWorkout as removeWorkout,
} from "../storage";

export interface CreateWorkoutDTO {
  title: string;
  items: Omit<WorkoutItem, "id">[];
}

export interface UpdateWorkoutDTO extends CreateWorkoutDTO {
  id: string;
}

export class WorkoutService {
  static createWorkout(data: CreateWorkoutDTO): Workout {
    const workout: Workout = {
      id: uuidv4(),
      title: data.title,
      date: new Date().toISOString(),
      items: data.items.map((item) => ({
        ...item,
        id: uuidv4(),
      })),
    };

    persistWorkout(workout);
    return workout;
  }

  static updateWorkout(data: UpdateWorkoutDTO): Workout | undefined {
    const workouts = getWorkouts();
    const index = workouts.findIndex((w) => w.id === data.id);

    if (index === -1) return undefined;

    const updatedWorkout: Workout = {
      ...workouts[index],
      title: data.title,
      items: data.items.map((item) => ({
        ...item,
        id: uuidv4(),
      })),
    };

    workouts[index] = updatedWorkout;
    localStorage.setItem("workouts", JSON.stringify(workouts));

    return updatedWorkout;
  }

  static deleteWorkout(id: string): void {
    removeWorkout(id);
  }

  static getWorkout(id: string): Workout | undefined {
    const workouts = getWorkouts();
    return workouts.find((workout) => workout.id === id);
  }

  static getAllWorkouts(): Workout[] {
    return getWorkouts();
  }

  static getWorkoutStats() {
    const workouts = this.getAllWorkouts();

    return {
      total: workouts.length,
      byType: workouts.reduce((acc: Record<string, number>, workout) => {
        acc[workout.title] = (acc[workout.title] || 0) + 1;
        return acc;
      }, {}),
      byDay: workouts.reduce((acc: Record<string, number>, workout) => {
        const day = new Date(workout.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {}),
    };
  }
}
