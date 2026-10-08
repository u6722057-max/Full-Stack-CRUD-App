# PetCare

PetCare is a full-stack pet health and appointment management system. Pet owners can manage multiple pets, store pet-specific health records, browse veterinarians, and manage appointments from a responsive web application.

## Live application

https://full-stack-crud-app-9z54.vercel.app/

## Features

- Visitor Home page with public doctor and appointment information
- User registration, sign in, and sign out
- Add and manage multiple pets
- Create pet-specific vaccination, treatment, allergy, medication, and observation records
- Switch between pets when viewing or adding health records
- Browse veterinarian profiles
- Create and manage appointments
- Responsive desktop and mobile navigation
- Admin management for users, doctors, and time slots

## Technology

- React and Vite frontend
- Next.js REST API backend
- MongoDB database
- JavaScript and CSS
- Vercel deployment

## Project structure

```text
Full-Stack-CRUD-App/
├── react-frontend/   # React and Vite frontend
├── next-backend/     # Next.js REST API and MongoDB integration
├── PetCare-Project-Proposal.docx
└── README.md
```

## Run locally

### Backend

```bash
cd next-backend
npm install
cp .env.local.example .env.local
npm run dev
```

Set `MONGODB_URI`, `DB_NAME`, `SESSION_SECRET`, and `CORS_ORIGIN` in `.env.local`.

### Frontend

```bash
cd react-frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and uses `http://localhost:3000` as the default API URL. To change it, set:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Never commit `.env.local` files or database credentials.

## Main API routes

| Resource | Collection route | Required create fields |
| --- | --- | --- |
| Pets | `/api/pets` | `name`, `species` |
| Health records | `/api/health-records` | `petId`, `type`, `title`, `recordDate` |
| Appointments | `/api/appointments` | `petId`, `clinicName`, `startsAt`, `reason` |
| Doctors | `/api/doctors` | `name`, `clinicName`, `specialty` |

Each resource supports `GET`, `POST`, `PUT`, and `DELETE` operations. Health records and appointments can be filtered with `?petId=...`.

## Authentication routes

- `POST /api/auth/sign-up`
- `POST /api/auth/sign-in`
- `GET /api/auth/session`
- `DELETE /api/auth/session`

## Team

- Nyein Chan Htet Naing
- Myat Phone Paye
- Lin Myat Thu
