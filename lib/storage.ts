"use client";

import type { Workout, WorkoutItem } from "./types";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

export const saveWorkout = async (
  workout: Workout
): Promise<Workout | null> => {
  const { data, errors } = await client.models.Workout.create(workout);
  if (errors) {
    console.error(errors);
  }
  return data;
};

export const saveWorkoutItem = async (
  workoutItem: WorkoutItem
): Promise<void> => {
  const { errors } = await client.models.WorkoutItem.create(workoutItem);
  if (errors) {
    console.error(errors);
  }
};

export const deleteWorkoutItem = async (
  workoutItemId: string
): Promise<void> => {
  const { errors } = await client.models.WorkoutItem.delete({
    id: workoutItemId,
  });
  if (errors) {
    console.error(errors);
  }
};

export const updateWorkoutItem = async (
  id: string,
  workoutItem: WorkoutItem
): Promise<void> => {
  const { errors } = await client.models.WorkoutItem.update({
    id: id,
    name: workoutItem.name,
    repeats: workoutItem.repeats,
    weight: workoutItem.weight,
    workoutId: workoutItem.workoutId,
  });
  if (errors) {
    console.error(errors);
  }
};

export const getWorkouts = async (): Promise<Workout[]> => {
  const { data: workoutsResult, errors } = await client.models.Workout.list();
  if (errors) {
    console.error(errors);
  }
  return workoutsResult;
};

export const getWorkoutById = async (
  id: string
): Promise<Workout | undefined> => {
  const workoutResult = await client.models.Workout.get({ id: id });
  return workoutResult.data ?? undefined;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await client.models.Workout.delete({ id: id });
};
export const updateWorkout = async (
  id: string,
  title: string
): Promise<void> => {
  await client.models.Workout.update({
    id: id,
    title: title,
  });
};
