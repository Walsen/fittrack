import type { Workout, WorkoutItem } from "../types";

export interface CreateWorkoutDTO {
  title: string;
  items: Omit<WorkoutItem, "id">[];
}

export interface UpdateWorkoutDTO extends CreateWorkoutDTO {
  id: string;
}

export class WorkoutService {
  static async createWorkout(data: CreateWorkoutDTO): Promise<Workout> {
    throw new Error("API implementation needed for workout creation");
  }

  static async updateWorkout(
    data: UpdateWorkoutDTO
  ): Promise<Workout | undefined> {
    throw new Error("API implementation needed for workout updates");
  }

  static async deleteWorkout(id: string): Promise<void> {
    throw new Error("API implementation needed for workout deletion");
  }

  static async getWorkout(id: string): Promise<Workout | undefined> {
    throw new Error("API implementation needed for fetching a single workout");
  }

  static async getAllWorkouts(): Promise<Workout[]> {
    throw new Error("API implementation needed for fetching all workouts");
  }

  static async getWorkoutStats() {
    throw new Error("API implementation needed for workout statistics");
  }
}
