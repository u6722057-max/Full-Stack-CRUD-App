import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

const envPath = path.resolve(".env.local");
const env = fs.readFileSync(envPath, "utf8");
const uri = env.match(/^MONGODB_URI=(.+)$/m)?.[1]?.trim();
const dbName = env.match(/^DB_NAME=(.+)$/m)?.[1]?.trim() || "petcare";

if (!uri) throw new Error("MONGODB_URI is missing from .env.local");

const doctors = [
  {
    name: "Dr. Maya Collins",
    gender: "Female",
    clinicName: "Green Paws Veterinary Clinic",
    specialty: "Small Animal Medicine",
    rating: 4.9,
    availableHours: "Mon-Fri, 9:00 AM-5:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Dr. Arjun Patel",
    gender: "Male",
    clinicName: "Happy Tails Animal Hospital",
    specialty: "Veterinary Surgery",
    rating: 4.8,
    availableHours: "Mon-Sat, 10:00 AM-6:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Dr. Sofia Reyes",
    gender: "Female",
    clinicName: "Pet Wellness Centre",
    specialty: "Animal Behaviour and Wellness",
    rating: 4.9,
    availableHours: "Tue-Sun, 8:00 AM-4:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=85",
  },
];

const client = new MongoClient(uri);
await client.connect();
const collection = client.db(dbName).collection("doctors");

for (const doctor of doctors) {
  await collection.updateOne(
    { name: doctor.name },
    { $set: { ...doctor, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
}

await client.close();
console.log(`Seeded ${doctors.length} PetCare doctors in ${dbName}.`);
