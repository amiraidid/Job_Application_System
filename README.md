# Job Application System (Clean Architecture)

A lightweight job application platform implemented with NestJS following Clean Architecture principles. It provides domain-driven modules for posting jobs, applying to jobs, scheduling interviews, commenting, and sending notifications. Persistence is handled with Prisma and a relational database (configured via `DATABASE_URL`).

## Key Features

- **Job posts**: create, update, list, and archive job postings.
- **Applications**: candidates can submit applications and view application status.
- **Interviews**: schedule interviews and track interview results.
- **Comments**: threaded comments on applications and job posts.
- **Notifications**: in-app notifications for important events.
- **Auth & Users**: user management and authentication for employers and candidates.

## Architecture Overview

This project follows Clean Architecture: the codebase is separated into clear layers so business rules remain independent from external frameworks.

- `src/domain` — Entities, value objects, and domain services (core business logic).
- `src/application` — Use-cases and application services orchestrating domain actions.
- `src/infrastructure` — Database, Prisma integration, external services, and adapters.
- `src/presentation` — HTTP controllers, DTOs, and NestJS modules exposing the API.

Prisma schema and migrations live in the `prisma/` directory.

## Step-by-step: What this project does

1. **Create or manage a job post**
	- An employer uses the API to create a job posting. The controller validates input and calls an application service.
	- The application service enforces business rules and persists the job via repository adapters (Prisma).

2. **List and browse job posts**
	- Candidates request job listings. Presentation layer controllers call read-only use-cases which fetch data from repositories and return DTOs.

3. **Submit an application**
	- A candidate submits an application to a job post via the API, attaching resume or profile details.
	- The application use-case validates eligibility and creates an application record (status: `submitted`).

4. **Application lifecycle & status updates**
	- Recruiters update application statuses (e.g., `review`, `interview`, `offer`, `rejected`).
	- Status changes emit domain events that trigger side effects (notifications, timeline entries).

5. **Schedule interviews**
	- The recruiter or system schedules interviews tied to an application; interview details are persisted and optionally notify participants.

6. **Comments and conversations**
	- Users can post comments related to applications or job posts. Comments are stored and surfaced in the related context.

7. **Notifications**
	- Important changes (status updates, interview scheduled) create notifications delivered via the `infrastructure/services` layer.

8. **Auth and user flows**
	- Authentication and authorization are handled in the `presentation/auth` module; roles determine access to protected actions.

## Development Setup

Prerequisites: Node.js (recommended >= 18), npm or pnpm, and a supported relational database.

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file with at least:

```
DATABASE_URL=""
PORT=3000
```

3. Run migrations and generate Prisma client

```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the app in development

```bash
npm run start:dev
```

5. Run tests

```bash
npm run test
```

6. Formatting and linting

```bash
npm run format
npm run lint
```

## Important Source Locations

- `src/application` — use-cases and application services.
- `src/domain` — domain entities and business rules.
- `src/infrastructure/prisma` — Prisma client and repository implementations.
- `src/presentation/controllers` — HTTP controllers and route handlers.
- `prisma/schema.prisma` — database schema and model definitions.

## Migrations

Migrations are stored under `prisma/migrations`. Use Prisma CLI to create, apply, or rollback migrations.

## Contributing

Contributions are welcome. Open issues and pull requests should include tests for behavior changes and be consistent with the repo's architecture.

## License

This repository does not include a license file. Add a `LICENSE` if you want to make the terms explicit.

---

If you'd like, I can also:

- Add a short API usage section with example requests.
- Add a developer quickstart script and `.env.example`.

Let me know which additions you prefer.

