import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as iam from "aws-cdk-lib/aws-iam";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const KnowledgeBaseDataSource =
  backend.data.resources.graphqlApi.addHttpDataSource(
    "WorkoutGymKnowledgeBaseDataSource",
    "https://bedrock-agent-runtime.us-east-1.amazonaws.com",
    {
      authorizationConfig: {
        signingRegion: "us-east-1",
        signingServiceName: "bedrock",
      },
    }
  );

KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new iam.PolicyStatement({
    resources: [
      `arn:aws:bedrock:us-east-1:${process.env.USER_ID}:knowledge-base/${process.env.KNOWLEDGEBASE_ID}`,
    ],
    actions: ["bedrock:Retrieve"],
  })
);
