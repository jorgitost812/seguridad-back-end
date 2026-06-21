# Seguridad Back-End

NestJS backend for security/management system.

## Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.8
- **ORM:** TypeORM 0.3
- **DB:** PostgreSQL (local, `seguridad` database)
- **Auth:** Passport + JWT
- **API Docs:** Swagger
- **Email:** @nestjs-modules/mailer + nodemailer
- **PDF:** @t00nday/nestjs-pdf + jspdf
- **Template engines:** EJS, Pug, Handlebars

## Commands

```bash
pnpm install          # install deps
pnpm run start:dev    # dev mode with watch
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
├── mail/           # Email service
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

## Notes

- DB credentials hardcoded in `app.module.ts` — migrate to ConfigModule
- `synchronize: true` dangerous in production
- Both `pnpm-lock.yaml` and `yarn.lock` exist — standardize on one
- `strictNullChecks: false` in tsconfig — loose typing
