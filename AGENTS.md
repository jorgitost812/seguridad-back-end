# Seguridad Back-End

NestJS backend for security/management system. Monorepo with `cc-fron/` Nuxt 2 frontend (separate project, runs on port 8080).

## Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.8
- **ORM:** TypeORM 0.3
- **DB:** PostgreSQL (local, `seguridad` database)
- **Auth:** Passport + JWT (strategy in `auth/jwt.strategy.ts`)
- **API Docs:** Swagger at `/api` with BearerAuth
- **Security:** Helmet headers, ThrottlerModule (10 req/min global), ConfigModule for env
- **Email:** @nestjs-modules/mailer + nodemailer
- **PDF:** @t00nday/nestjs-pdf + jspdf
- **Template engines:** EJS, Pug, Handlebars

## Commands

```bash
yarn install          # install deps
yarn start:dev        # dev mode with watch (port 3000)
yarn build            # build to dist/
yarn start:prod       # run production build
yarn lint             # eslint fix
yarn test             # unit tests
yarn test:e2e         # e2e tests
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
├── mail/           # Email service (templates in mail/templates/)
├── pdf/            # PDF generation
├── helpers/        # Utility functions (crypto, constants)
└── main.ts         # Bootstrap
```

## Conventions

- Entities in `entities/` subfolder per module
- DTOs in `dto/` subfolder per module
- Controllers in `controllers/` or flat in module root
- Services in `services/` subfolder
- Use `class-validator` + `class-transformer` for validation
- JWT strategy in `auth/jwt.strategy.ts` — reads secret via `ConfigService`
- Roles: `@Roles()` decorator + `RolesGuard`
- TypeORM sync controlled by `DB_SYNCHRONIZE` env var (default: `false`)
- `ConfigModule.forRoot({ isGlobal: true })` loads `.env` — use `ConfigService` for secrets

## Auth Flow

- `passport-local` strategy for login, returns JWT token
- `passport-jwt` strategy validates token, returns `{userId, email, rol, jcId}`
- `RolesGuard` checks `user.rol.nombre` against required roles
- `JcGuard` ensures user has a `jcId`, sets `request.userJcId`
- Passwords hashed via `bcrypt` in `@BeforeInsert` / `@BeforeUpdate` hooks on `Usuario` entity
- JWT expires in 6h
- `JwtModule.registerAsync` with `ConfigService` — do NOT import `jwtConstants` at module level

## Environment

`.env` at root (gitignored, also `src/.env` duplicate):
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=seguridad
JWT_SECRET=...
DB_SYNCHRONIZE=false
CORS_ORIGIN=http://localhost:8080
CRYPTO_KEY=...
```

All env vars read via `process.env` or `ConfigService` — never hardcoded in source.

## Key Gotchas

- `strictNullChecks: false`, `noImplicitAny: false` in tsconfig — loose typing
- `dist/` directory is in `.gitignore`
- `mail/templates/` copied to `dist/` via `nest-cli.json` assets config
- SQL scripts at root: `check-users.sql`, `fix-nulls.sql`, `seed-users.sql`
- CORS configured for `http://localhost:8080` (the Nuxt frontend)
- `synchronize: true` must NEVER be set in production — controlled by env var
- Frontend expects `user.rol.nombre` — always optional-chain when accessing nested user fields
- Node engine warnings: project uses Node 23.x, some deps expect 18/20/22 — `--ignore-engines` needed for yarn
- `@t00nday/nestjs-pdf` has incorrect peer dep on `@nestjs/common@^8` — use `--legacy-peer-deps` with npm

## Security (post-audit)

- Secrets loaded from `.env` via `ConfigModule`/`ConfigService`
- Helmet middleware active (security headers)
- Rate limiting: 10 req/min global, `@UseGuards(ThrottlerGuard)` on login
- All controllers require `@UseGuards(JwtAuthGuard)` — no unguarded endpoints
- SQL injection prevented via parameterized QueryBuilder in `caccesos.service.ts`
- `JSON.parse` on URL params wrapped in try/catch with `BadRequestException`
- No `console.log` of passwords or sensitive data
