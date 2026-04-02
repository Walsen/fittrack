# FitTrack - Your Personal AI-Powered Workout Assistant

FitTrack is a modern web application that helps users track their workouts, get personalized fitness advice, and achieve their fitness goals. Built with Next.js and AWS Amplify, it combines powerful workout tracking capabilities with an AI-powered chat assistant to provide a comprehensive fitness companion.

The application features an intuitive workout creation system, detailed workout history tracking, and insightful statistics visualization. Users can create custom workouts, track their progress over time, and receive AI-powered guidance through an integrated chat interface. The application leverages AWS Bedrock for intelligent workout analysis and recommendations, making it a smart choice for both beginners and experienced fitness enthusiasts.

## Repository Structure
```
.
├── amplify/                  # AWS Amplify backend configuration and resources
│   ├── auth/                # Authentication configuration
│   ├── data/                # Data models and API configuration
│   └── backend.ts           # Main backend configuration file
├── app/                     # Next.js application routes and pages
│   ├── api/                # API route handlers
│   ├── chat/               # AI chat interface
│   ├── create/             # Workout creation page
│   ├── edit/               # Workout editing functionality
│   ├── history/            # Workout history view
│   └── workout/            # Individual workout view
├── components/             # Reusable React components
│   ├── ui/                # UI component library
│   └── workout-*.tsx      # Workout-specific components
└── lib/                   # Shared utilities and services
    ├── services/          # Business logic services
    └── types.ts           # TypeScript type definitions
```

## Usage Instructions
### Prerequisites
- Node.js 18.x or later
- pnpm package manager
- AWS account with appropriate credentials

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fittrack

# Install dependencies
pnpm install

# Run the Amplify Sandbox
pnpm ampx sandbox
```

### Environment Configuration

#### Required Environment Variables

| Variable | Required | Context | Description |
|---|---|---|---|
| `KNOWLEDGEBASE_ID` | Yes | Amplify sandbox / CI | Bedrock Knowledge Base ID used for the gym-search tool. The sandbox will fail to start without it. |
| `KB_BUCKET_NAME` | No | Amplify sandbox / CI | Name of an existing S3 bucket to reuse for the Knowledge Base data source. If omitted, a new bucket is created on first deploy. |
| `AWS_PROFILE` | Yes (local) | Shell / `.envrc` | AWS CLI profile with permissions for Amplify, Bedrock, and related services. Defaults to `awscbba` via the `.envrc` file. |

#### Bedrock Knowledge Base Setup

The AI assistant uses a Bedrock Knowledge Base backed by an S3 data source to answer gym-related queries. The S3 bucket is created automatically by the Amplify backend (`KBBucketName` stack output), but the Knowledge Base itself must be created manually.

1. **Start the sandbox once** (without `KNOWLEDGEBASE_ID`) to provision the S3 bucket. The command will fail — that's expected. Note the `KBBucketName` value from the stack outputs.

2. **Seed the bucket** with gym/fitness documents (place your files in `docs/kb-data/`):
   ```bash
   just seed-kb <KBBucketName>
   ```

3. **Create the Knowledge Base** in the [Amazon Bedrock console](https://console.aws.amazon.com/bedrock/home#/knowledge-bases):
   - Name: any descriptive name (e.g. `fittrack-gym-kb`)
   - Data source: choose **Amazon S3** and point it to the bucket from step 1
   - Embedding model: select an available embeddings model (e.g. Titan Embeddings V2)
   - Vector store: use the default (Bedrock-managed OpenSearch Serverless)
   - After creation, click **Sync** on the data source to index the documents

4. **Copy the Knowledge Base ID** from the console (format: `XXXXXXXXXX`).

5. **Start the sandbox** with the ID:
   ```bash
   KNOWLEDGEBASE_ID=<your-kb-id> pnpm ampx sandbox
   ```
   Or add it to a `.env` file (the `justfile` has `set dotenv-load` enabled):
   ```
   KNOWLEDGEBASE_ID=<your-kb-id>
   ```
   Then simply run:
   ```bash
   just sandbox
   ```

> **How it works:** The `searchGym` query in `amplify/data/resource.ts` uses an AppSync HTTP data source that calls the Bedrock `Retrieve` API. The resolver (`amplify/data/bedrockresolver.js`) sends the user's input as a retrieval query and returns matching Knowledge Base results to the AI conversation tool.

#### Devbox

The project includes a `devbox.json` that provisions Node.js, AWS CLI, just, pnpm, jq, yq, and zellij. If you have devbox and direnv installed, the environment activates automatically when you `cd` into the project.

### Quick Start
1. Start the development server:
```bash
pnpm dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Sign up for a new account using the authentication system

4. Create your first workout:
```typescript
// Example workout creation
const workout = {
  title: "Full Body Workout",
  exercises: [
    { name: "Push-ups", repeats: 10, weight: 0 },
    { name: "Squats", repeats: 15, weight: 0 }
  ]
};
```
## Data Flow
The application follows a client-server architecture with AWS Amplify handling the backend services.

```ascii
+----------------+     +-----------------+     +------------------+
|                |     |                 |     |                  |
| React Frontend |<--->| Next.js API     |<--->| AWS Amplify     |
| Components     |     | Routes          |     | Backend Services |
|                |     |                 |     |                  |
+----------------+     +-----------------+     +------------------+
        ^                                            ^
        |                                            |
        v                                            v
+----------------+                           +------------------+
|                |                           |                  |
| Local Storage  |                           | AWS Bedrock      |
| (Cache)        |                           | (AI Assistant)   |
|                |                           |                  |
+----------------+                           +------------------+
```

Key component interactions:
1. Frontend components make API calls to Next.js routes
2. API routes communicate with AWS Amplify backend services
3. Authentication is handled by AWS Cognito through Amplify
4. Workout data is stored in AWS DynamoDB
5. AI chat functionality uses AWS Bedrock
6. Local storage caches user preferences and session data
7. Real-time updates are handled through WebSocket connections

## Infrastructure

![Infrastructure diagram](./docs/infra.svg)
### AWS Resources
- AppSync:
  - Purpose: Handles API requests and data processing

- DynamoDB:
  - Purpose: Stores workout and user data

- Cognito:
  - Purpose: Manages user authentication

- Amazon Bedrock
  - Purpose: Provides AI-powered workout assistance through LLMs and Knowledge Bases