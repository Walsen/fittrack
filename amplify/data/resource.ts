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
  analyzeTraining: a
    .generation({
      aiModel: a.ai.model("Claude Haiku 4.5"),
      systemPrompt: `You are a helpful assistant for gym training. 
      You will be provided with a set of trainings and analyze them with which muscles are used and what other trainings can be done.
      Your analysis should not be shorter than 50 characters and longer than 400 characters.`,
    })
    .arguments({
      trainings: a.string().array(),
    })
    .returns(a.customType({ analysis: a.string() }))
    .authorization((allow) => [allow.authenticated()]),

  workoutAssistant: a
    .conversation({
      aiModel: a.ai.model("Claude Haiku 4.5"),
      systemPrompt: `You are a fitness and body health assistant. You ONLY answer questions related to fitness, workouts, exercise, nutrition, body health, and gym-related topics. If the user asks about anything outside these topics, politely decline and redirect them to fitness-related questions. Always respond in the same language the user writes in.
      IMPORTANT: When the user asks about their workouts, training history, or progress, you MUST call the SearchWorkout tool immediately without asking for clarification. Always try the tool first.
      When the user asks about gyms or equipment, call the WorkoutGymKnowledgeBase tool.
      When asked to create a plan, return it in exercise name, sets x reps, and weight format.
      `,
      tools: [
        a.ai.dataTool({
          model: a.ref("Workout"),
          modelOperation: "list",
          name: "SearchWorkout",
          description:
            "Used to search for a workout with a matching or similar title",
        }),
        a.ai.dataTool({
          name: "WorkoutGymKnowledgeBase",
          description:
            "Used to search for the best gym for workouts. The decision will be based on exercise devices from the related gym.",
          query: a.ref("searchGym"),
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
  searchGym: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "WorkoutGymKnowledgeBaseDataSource",
        entry: "./bedrockresolver.js",
      })
    )
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
