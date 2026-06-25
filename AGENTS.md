# Seguridad Back-End

NestJS backend for security/management system. Monorepo with `cc-fron/` Nuxt 2 frontend (separate project, runs on port 8080).

## Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.8
- **ORM:** TypeORM 0.3
- **DB:** PostgreSQL (local, `seguridad` database)
- **Auth:** Passport + JWT (strategy in `auth/jwt.strategy.ts`)
- **API Docs:** Swagger at `/api` with BearerAuth
- **Email:** @nestjs-modules/mailer + nodemailer
- **PDF:** @t00nday/nestjs-pdf + jspdf
- **Template engines:** EJS, Pug, Handlebars

## Commands

```bash
pnpm install          # install deps
pnpm run start:dev    # dev mode with watch (port 3000)
pnpm run build        # build to dist/
pnpm run start:prod   # run production build
pnpm run lint         # eslint fix
pnpm run test         # unit tests
pnpm run test:e2e     # e2e tests
```

## Project Structure

```
src/
├── auth/           # JWT auth, guards, strategies, roles
├── usuarios/       # Users CRUD, login
├── roles/          # Roles management
├── funcionesroles/ # Role-function permissions
├── accesos/        # Access reports
├── trazas/         # Audit logs
├── provincias/     # Provinces
├── municipios/     # Municipalities
├── jcs/            # Joven Club entities
├── pcs/            # PC entities + access
├── dashboard/      # Dashboard endpoints
├── mail/           # Email service (templates in mail/templates/)
├── pdf/            # PDF generation
├── helpers/        # Utility functions
├── database/       # DB config/migrations
└── main.ts         # Bootstrap
```

## Conventions

- Entities in `entities/` subfolder per module
- DTOs in `dto/` subfolder per module
- Controllers in `controllers/` or flat in module root
- Services in `services/` subfolder
- Use `class-validator` + `class-transformer` for validation
- JWT strategy in `auth/jwt.strategy.ts`
- Roles: `@Roles()` decorator + `RolesGuard`
- TypeORM sync: `synchronize: true` (dev only)

## Auth Flow

- `passport-local` strategy for login, returns JWT token
- `passport-jwt` strategy validates token, returns `{userId, email, rol, jcId}`
- `RolesGuard` checks `user.rol.nombre` against required roles
- `JcGuard` ensures user has a `jcId`, sets `request.userJcId`
- Passwords hashed via `bcrypt` in `@BeforeInsert` / `@BeforeUpdate` hooks on `Usuario` entity
- JWT expires in 6h

## Environment

`.env` at root:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=seguridad
JWT_SECRET=...
```

**Note:** `src/.env` is a duplicate of root `.env` — both exist and both are tracked. The `auth/constants.ts` hardcodes the same JWT secret. ConfigModule not used yet.

## Key Gotchas

- DB credentials hardcoded in `app.module.ts`, `data-source.ts`, `src/.env`, and root `.env` — four places to update
- `synchronize: true` dangerous in production
- Both `pnpm-lock.yaml` and `yarn.lock` exist — standardize on one
- `strictNullChecks: false`, `noImplicitAny: false` in tsconfig — loose typing
- `dist/` directory is tracked in git (should be in `.gitignore`)
- `mail/templates/` copied to `dist/` via `nest-cli.json` assets config
- SQL scripts at root: `check-users.sql`, `fix-nulls.sql`, `seed-users.sql`
- CORS enabled for `http://localhost:8080` (the Nuxt frontend)
