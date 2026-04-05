import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";

const backend = defineBackend({
  auth,
  data,
});

const dataStack = Stack.of(backend.data.resources.graphqlApi);

// Shared Knowledge Base bucket — created once, reused across all environments.
// On first run (no KB_BUCKET_NAME set), a new bucket is created and its name
// is emitted as a stack output. Subsequent environments import it by name.
const bucketName = process.env.KB_BUCKET_NAME;
const kbBucket = bucketName
  ? s3.Bucket.fromBucketName(dataStack, "KnowledgeBaseBucket", bucketName)
  : new s3.Bucket(dataStack, "KnowledgeBaseBucket", {
      removalPolicy: RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

const knowledgeBaseId = process.env.KNOWLEDGEBASE_ID ?? "PLACEHOLDER";

const kbHttpDataSource =
  backend.data.resources.graphqlApi.addHttpDataSource(
    "WorkoutGymKnowledgeBaseDataSource",
    `https://bedrock-agent-runtime.${dataStack.region}.amazonaws.com`,
    {
      authorizationConfig: {
        signingRegion: dataStack.region,
        signingServiceName: "bedrock",
      },
    }
  );

if (process.env.KNOWLEDGEBASE_ID) {
  kbHttpDataSource.grantPrincipal.addToPrincipalPolicy(
    new iam.PolicyStatement({
      resources: [
        `arn:aws:bedrock:${dataStack.region}:${dataStack.account}:knowledge-base/${knowledgeBaseId}`,
      ],
      actions: ["bedrock:Retrieve"],
    })
  );

  backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
    KNOWLEDGEBASE_ID: knowledgeBaseId,
  };
}

if (!bucketName) {
  new CfnOutput(dataStack, "KBBucketName", {
    value: kbBucket.bucketName,
  });
}
