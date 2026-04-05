set dotenv-load

pkg := env("PKG_MANAGER", "npm")

# List available tasks
default:
    @just --list

# Install dependencies and configure git hooks
install:
    {{pkg}} install
    git config core.hooksPath .githooks

# Start Next.js dev server
dev:
    {{pkg}} run dev

# Start sandbox + dev server together
up:
    pnpm exec ampx sandbox & {{pkg}} run dev

# Start Amplify sandbox
sandbox:
    pnpm exec ampx sandbox

# Destroy Amplify sandbox
sandbox-delete:
    pnpm exec ampx sandbox delete

# Build for production
build:
    {{pkg}} run build

# Deploy to production (requires --app-id)
deploy app-id branch="main":
    pnpm exec ampx pipeline-deploy --branch {{branch}} --app-id {{app-id}}

# Sync Knowledge Base documents to S3 (uses KB_BUCKET_NAME from .envrc)
seed-kb:
    aws s3 sync ./docs/kb-data s3://{{env_var("KB_BUCKET_NAME")}} --delete

# Sync Knowledge Base documents to S3 (explicit bucket override)
seed-kb-to bucket:
    aws s3 sync ./docs/kb-data s3://{{bucket}} --delete

# Run linter
lint:
    {{pkg}} run lint
