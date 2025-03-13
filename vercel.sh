#!/bin/bash

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
echo "Installing AWS CLI"
./aws/install

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed"
    exit 1
fi

# Exit on any error
set -e

# Check if VERCEL is true (only run during deployment)
if [ "$VERCEL" != "1" ]; then
    echo "This script should only run during Vercel deployment"
    exit 1
fi

# Ensure required environment variables are set
if [ -z "$VERCEL_GIT_REPO_SLUG" ] || [ -z "$AWS_ROLE_ARN" ]; then
    echo "Required environment variables are not set"
    exit 1
fi

echo "Assume the IAM role using the OIDC token"
CREDENTIALS=$(aws sts assume-role-with-web-identity \
    --role-arn "$AWS_ROLE_ARN" \
    --role-session-name "VercelDeploy-${VERCEL_GIT_REPO_SLUG}" \
    --web-identity-token "$VERCEL_OIDC_TOKEN" \
    --duration-seconds 3600)

echo "Export the temporary credentials"
export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS | grep -o '"AccessKeyId": "[^"]*' | cut -d'"' -f4)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS | grep -o '"SecretAccessKey": "[^"]*' | cut -d'"' -f4) 
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS | grep -o '"SessionToken": "[^"]*' | cut -d'"' -f4)
export AWS_REGION="eu-central-1"

echo "Verify AWS configuration"
aws sts get-caller-identity

echo "AWS credentials configured successfully"

echo "Trying Amplify"
npx ampx generate outputs --app-id $AMPLIFY_APP_ID --branch main


echo "Building Next"
next build
