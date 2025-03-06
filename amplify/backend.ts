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
    "https://bedrock-agent-runtime.<region>.amazonaws.com",
    {
      authorizationConfig: {
        signingRegion: "<region>",
        signingServiceName: "bedrock",
      },
    }
  );

KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new iam.PolicyStatement({
    resources: [
      "arn:aws:bedrock:<region>:<user-id>:knowledge-base/<knowledge-base-id>",
    ],
    actions: ["bedrock:Retrieve"],
  })
);
