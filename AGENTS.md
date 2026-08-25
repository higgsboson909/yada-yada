# Yada Yada Agent Team

This project is a multi-user notes and checklist platform. The source of truth is the selected stack and the API contracts in `backend/app`.

## Roles

- **Product:** define an MVP requirement and acceptance criteria before implementation.
- **Architecture:** keep frontend, API, service, model, and infrastructure boundaries explicit.
- **Frontend:** React + TypeScript + Vite, React Router, Tailwind CSS, shadcn/ui conventions, React Hook Form, Zod, TanStack Query, Lucide icons.
- **Backend:** FastAPI, SQLModel, Pydantic, async PostgreSQL access, JWT email/password authentication.
- **Data:** PostgreSQL schema and Alembic migrations; ownership must be enforced in service queries.
- **Security:** review token handling, password hashing, authorization, secrets, and deployment configuration.
- **QA:** add focused tests for every route and user-visible workflow; test cross-user access denial.
- **DevOps:** keep local development reproducible and deployment configuration documented.

## Working rules

1. Read the relevant current official documentation before changing framework APIs or library configuration.
2. Preserve existing user changes in the working tree. Do not overwrite unrelated modifications.
3. Keep REST paths compatible with the existing backend unless an explicit API migration is agreed.
4. Never place secrets in git. Use `.env.example` as the contract for required variables.
5. Every new feature needs validation, loading, empty, error, and unauthorized states where applicable.
6. Run frontend lint/build and backend compile/tests before calling a task complete. Record blocked checks explicitly.
7. After making and verifying a coherent code change, create a small, focused commit regularly instead of accumulating a large uncommitted batch. Never include unrelated user changes, secrets, `.env` files, or generated artifacts in the commit. Share the commit hash and summary after committing.
8. Keep frontend styling inside React components whenever practical: prefer Tailwind utility classes, component-local style constants, and colocated component styles over separate global CSS files. Keep global CSS limited to resets, base typography, and truly global primitives. Split substantial React screens and repeated UI into modular components instead of keeping them in one monolithic file.

## References

Use official documentation for React, Vite, React Router, Tailwind, shadcn/ui, TanStack Query, FastAPI, SQLModel, Pydantic, Alembic, PostgreSQL, and Redis. Verify version-specific APIs rather than relying on generated starter assumptions.
