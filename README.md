# PetCare

PetCare is a full-stack pet health and appointment management system. Pet owners can manage multiple pets, store pet-specific health records, browse veterinarians, and manage appointments from a responsive web application.

## Live application

https://full-stack-crud-app-9z54.vercel.app/

## Team Member Repository
https://github.com/NAGR1/web_final_project
https://github.com/u6722057-max/Full-Stack-CRUD-App
https://github.com/KnoxHasGF/Final_Project.git

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

## Application Screenshots

## 1. Sign In
<img width="1908" height="906" alt="image" src="https://github.com/user-attachments/assets/089ccb66-9069-4451-ab2f-b428d671361a" />

## 2. Sign Up
<img width="1889" height="917" alt="image" src="https://github.com/user-attachments/assets/8cf3a9cf-1b99-43f0-8d27-2742591fdbc8" />

## 3. Add a Pet
<img width="1909" height="917" alt="image" src="https://github.com/user-attachments/assets/9f97b0d4-fdc2-43f3-8301-5728c0b34658" />

## 4. Choose a Doctor
<img width="1911" height="913" alt="image" src="https://github.com/user-attachments/assets/c1a6c0fe-4eb3-488f-868d-3c1e80e330f5" />

## 5. Select Appointment Date and Time
<img width="1886" height="914" alt="image" src="https://github.com/user-attachments/assets/3bd1461d-8437-42f7-8dbf-0b3b2d9ced23" />

## 6. Appointment Schedule
<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/78fa5f4e-d353-4eac-87fb-a5de440c416e" />

## 7. Pet Health Records
<img width="1907" height="913" alt="image" src="https://github.com/user-attachments/assets/68170f10-df53-47ec-9cf2-05f4ba9a4349" />

