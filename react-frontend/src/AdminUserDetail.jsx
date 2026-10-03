import React, { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Field({ label, value, setValue, type = "text", choices }) {
  return <label className="field"><small>{label}</small>{choices ? <select value={value} onChange={e => setValue(e.target.value)}>{choices.map(choice => <option key={choice}>{choice}</option>)}</select> : <input type={type} value={value} onChange={e => setValue(e.target.value)} />}</label>;
}

function Button({ children, ...props }) { return <button className="button" {...props}>{children}</button>; }

function PetEditor({ pet, onSaved }) {
  const [data, setData] = useState(pet);
  const set = (key) => (value) => setData(current => ({ ...current, [key]: value }));
  async function save() {
    const response = await fetch(`${apiBaseUrl}/api/admin/pets/${data._id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not save pet");
    onSaved(result.pet);
  }
  return <article className="admin-pet-editor"><h3>{data.name}</h3><div className="split"><Field label="Pet name" value={data.name || ""} setValue={set("name")} /><Field label="Species" value={data.species || "Dog"} setValue={set("species")} choices={["Dog", "Cat"]} /></div><div className="split"><Field label="Age" value={data.age || ""} setValue={set("age")} /><Field label="Weight (kg)" value={data.weight || ""} setValue={set("weight")} /></div><div className="split"><Field label="Color" value={data.color || ""} setValue={set("color")} /><Field label="Sex" value={data.sex || "Unknown"} setValue={set("sex")} choices={["Female", "Male", "Unknown"]} /></div><Button onClick={() => save().catch(error => onSaved(null, error.message))}>Save pet information</Button></article>;
}

export default function AdminUserDetail({ user, onBack, onUserSaved }) {
  const [name, setName] = useState(user.name || ""); const [email, setEmail] = useState(user.email || ""); const [phone, setPhone] = useState(user.phone || ""); const [gender, setGender] = useState(user.gender || "Female"); const [pets, setPets] = useState([]); const [message, setMessage] = useState("");
  useEffect(() => { fetch(`${apiBaseUrl}/api/admin/pets`, { credentials: "include" }).then(r => r.ok ? r.json() : { pets: [] }).then(data => setPets((data.pets || []).filter(pet => pet.ownerId === user.id))).catch(() => setMessage("Could not load related pets.")); }, [user.id]);
  async function saveUser() { try { const response = await fetch(`${apiBaseUrl}/api/admin/users/${user.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, gender }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); onUserSaved(data.user); onBack(); } catch (error) { setMessage(error.message || "Could not save user."); } }
  return <><header className="header"><button onClick={onBack}>‹</button><b>User details</b><span /></header><main className="admin-page user-detail-page"><section className="page-intro"><h1>{user.name}</h1><p>Edit customer information and all pets related to this account.</p></section><section className="admin-detail-card"><h2>Customer information</h2><Field label="Name" value={name} setValue={setName} /><Field label="Email" type="email" value={email} setValue={setEmail} /><Field label="Phone number" value={phone} setValue={setPhone} /><Field label="Gender" value={gender} setValue={setGender} choices={["Female", "Male"]} /><Button onClick={saveUser}>Save user information</Button></section><section className="related-pets"><h2>Related pets</h2>{pets.length ? pets.map(pet => <PetEditor key={pet._id} pet={pet} onSaved={(updated, error) => { if (error) setMessage(error); else { setPets(current => current.map(item => item._id === updated._id ? updated : item)); onBack(); } }} />) : <p className="empty-state">This user has no saved pets.</p>}</section>{message && <p className={message.includes("saved") ? "success-message" : "auth-error"}>{message}</p>}</main></>;
}
