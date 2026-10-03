# PetCare Next.js backend

This is the REST API for PetCare. It uses Next.js route handlers and a MongoDB
database controlled by the project team. It does not use Firebase, Supabase,
or any managed backend service.

## Local setup

1. Install and run MongoDB locally, or run MongoDB on the team's VM.
2. Copy `.env.local.example` to `.env.local`.
3. Set `MONGODB_URI` to the connection string for that MongoDB server.
4. Run `npm install`, then `npm run dev`.

Run `npm run seed:doctors` once to add the three fictional PetCare doctor
profiles used by the frontend. Re-running it updates those same profiles rather
than creating duplicates.

For local demonstration, `npm run seed:admin` creates an administrator account:
`admin@petcare.local`. Change this account and password before deployment.

The Vite frontend defaults to `http://localhost:5173`; update `CORS_ORIGIN`
if the frontend runs at another address. Never commit `.env.local`.

Set a private `SESSION_SECRET` of at least 32 characters in `.env.local`. It
signs the secure HTTP-only session cookie used after sign-up and sign-in.

## PetCare REST API

| Resource | Collection route | Required create/update fields |
| --- | --- | --- |
| Pets | `/api/pets` | `name`, `species` |
| Health records | `/api/health-records` | `petId`, `type`, `title`, `recordDate` |
| Appointments | `/api/appointments` | `petId`, `clinicName`, `startsAt`, `reason` |
| Doctors | `/api/doctors` | `name`, `clinicName`, `specialty` |

Each resource supports:

- `GET /api/{resource}`: list documents. Health records and appointments also
  accept `?petId=...`.
- `POST /api/{resource}`: create a document.
- `GET /api/{resource}/{id}`: retrieve one document.
- `PUT /api/{resource}/{id}`: update a document.
- `DELETE /api/{resource}/{id}`: permanently delete a document.

Documents receive `createdAt` and `updatedAt` timestamps automatically.
Malformed IDs, missing required fields, and missing documents return clear HTTP
error responses.

## Authentication API

- `POST /api/auth/sign-up`: creates an account using `name`, `email`, and an
  eight-character-or-longer password. Passwords are salted and hashed on the
  server; plain passwords are not stored.
- `POST /api/auth/sign-in`: signs in with `email` and `password` and sends an
  HTTP-only session cookie.
- `GET /api/auth/session`: reads the current session.
- `DELETE /api/auth/session`: signs out and clears the session cookie.

The original sample `item`, `hello`, and `mongo_test` routes remain available
as development examples. The PetCare frontend should use the three PetCare
resource groups above.
