import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  WorkoutItem: a
    .model({
      name: a.string().required(),
      repeats: a.integer().required(),
      weight: a.float().required(),
      workoutId: a.id(),
      workout: a.belongsTo("Workout", "workoutId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Workout: a
    .model({
      title: a.string().required(),
      date: a.datetime().required(),
      items: a.hasMany("WorkoutItem", "workoutId"),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
