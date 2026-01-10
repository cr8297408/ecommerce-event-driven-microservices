FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/domain/package.json ./packages/domain/

# Install global dependencies if needed or adjust for workspace
# Assuming we are building in context of the monorepo root or copying everything?
# Standard microservice dockerfile usually copies what is needed.
# Since this is a monorepo, usually we copy pnpm-workspace.yaml or similar if used, 
# or we use a multi-stage build from root.
# For simplicity in this dev environment (as seen in users/Dockerfile likely), I will check one first.

COPY . .

# Adjust based on how other services are built. 
# I will check users/Dockerfile to match the pattern exactly.
