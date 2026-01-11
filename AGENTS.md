# Project Guidelines & Architecture

This document tracks the architectural decisions, patterns, and rules for the **Ecommerce Event-Driven** project.

## 🏗 Architecture Overview

The system follows an **Event-Driven Microservices** architecture using **Kafka** as the message broker.

- **Monorepo Structure**:
    - `servers/`: Contains the microservices (e.g., `api-gateway`, `users`).
    - `packages/`: Shared libraries (e.g., `domain`).
- **Framework**: NestJS.
- **Communication**: 
    - **External**: REST API (via API Gateway).
    - **Internal**: Kafka (Request-Response or Event Emission).

## 🧩 The "Steps" Pattern

We avoid "Fat Services" by breaking down business logic into atomic, reusable **Steps**.

### Rules for Steps
1.  **Single Responsibility**: Each step handles **one** specific action (e.g., `HashPasswordStep`, `FindUserByEmailStep`, `CreateUserStep`).
2.  **Location**: `src/steps/`.
3.  **Naming Convention**: `[Action][Subject]Step` (e.g., `UpdateUserStatusStep`).
4.  **Usage**: Steps are injected into the Service (e.g., `AppService`), which orchestrates them. 
    - *The Service should act as a conductor, not a performer.*

**Example:**
```typescript
// app.service.ts
async createUser(data) {
  const hash = await this.hashPasswordStep.execute(data.password); // Step 1
  await this.createUserStep.execute(data, hash);                   // Step 2
}
```

## 📦 Domain Package (`packages/domain`)

The `domain` package is the **source of truth** for all contracts between services.

- **Events**: All Kafka event definitions (classes extending `EventModel` or interfaces).
- **Topics**: Central `Topics` enum for all Kafka topics.
- **Interfaces**: Shared DTOs and types.

**Rule**: If a DTO or Event is shared or used for communication, it **must** be defined in `packages/domain` first.

## 🛡 Validation & Database

- **Validation**: Use **Joi** schemas for runtime validation of incoming Kafka messages.
    - Location: `src/validations/`.
- **Database**: Use **TypeORM** with Entities.
    - Location: `src/entities/`.
    - **Rule**: Updates to entities usually happen within a `Step`.

## 🔄 Development Workflow

1.  **Define Contracts**: Update `packages/domain` with new Topics or Events.
2.  **API Gateway**: Create/Update DTOs and Controller endpoints to expose simple REST APIs. forwarding to Kafka.
3.  **Microservice Implementation**:
    - Create necessary `Steps` for the logic.
    - Create `Joi` schema for validation.
    - Orchestrate steps in the `Service` method.
    - Listen to the topic in the `Controller`.

## 📝 General Rules

- **Statelessness**: Prefer stateless verification flows (e.g., JWT) over DB-stored tokens where possible.
- **Artifacts**: Maintain `task.md`, `implementation_plan.md`, and `walkthrough.md` for complex tasks.

## 🪵 Logging & Observability

Implement **strategic logging** to make the system behavior observable and easy to debug. Use **descriptive emojis** to categorize log entries:

- 📥 **Incoming**: Received Kafka messages or HTTP requests (e.g., `📥 Mensaje recibido en Kafka...`).
- 📤 **Outgoing**: Emitted events or sent responses (e.g., `📤 Emitting UserCreatedEvent...`).
- 🔍 **Processing**: Starting a search, validation, or complex step (e.g., `🔍 Verifying account with token...`).
- ✅ **Success**: Successful completion of a critical action (e.g., `✅ Account activated`).
- ⚠️ **Warning**: Business logic denials or non-critical issues (e.g., `⚠️ Token expired`).
- ❌ **Error**: Exceptions or critical failures (e.g., `❌ Token verification failed`).

## 🎨 Coding Standards & Best Practices

- **Strict Typing**:
    - 🚫 **No `any`**: The use of `any` is strictly forbidden. Always use rigorous TypeScript typing (interfaces, classes, or types).
    - Use `unknown` if the type is truly uncertain, and validate it before use.
- **Microservice Communication**:
    - Always strictly type event payloads.
- **Error Handling**:
    - Do not swallow errors. Catch, log with emojis, and re-throw or handle gracefully.
    - Return structured responses (e.g., `{ success: boolean, message: string }`) instead of boolean flags for business logic results.
