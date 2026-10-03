import React, { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Field({ label, value, setValue, type = "text", choices, min, max, step }) {
  return <label className="field"><small>{label}</small>{choices ? <select value={value} onChange={event => setValue(event.target.value)}>{choices.map(choice => <option key={choice}>{choice}</option>)}</select> : <input type={type} min={min} max={max} step={step} value={value} onChange={event => setValue(event.target.value)} />}</label>;
}

export default function AdminDoctorDetail({ doctor, onBack, onSaved }) {
  const isNew = !doctor;
  const record = doctor || {};
  const [name, setName] = useState(record.name || "");
  const [specialty, setSpecialty] = useState(record.specialty || "");
  const [clinicName, setClinicName] = useState(record.clinicName || "");
  const [availableHours, setAvailableHours] = useState(record.availableHours || "");
  const [gender, setGender] = useState(record.gender || "Female");
  const [rating, setRating] = useState(record.rating || "");
  const [photoUrl, setPhotoUrl] = useState(record.photoUrl || "");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function choosePhoto(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/") || selected.size > 5 * 1024 * 1024) { setMessage("Choose a JPG, PNG, or WebP image up to 5 MB."); return; }
    setFile(selected); setPhotoUrl(URL.createObjectURL(selected)); setMessage("");
  }
  async function save() {
    setSaving(true); setMessage("");
    try {
      let savedPhotoUrl = photoUrl;
      if (file) {
        const form = new FormData(); form.append("photo", file);
        const uploaded = await fetch(`${apiBaseUrl}/api/uploads`, { method: "POST", credentials: "include", body: form });
        const uploadData = await uploaded.json();
        if (!uploaded.ok) throw new Error(uploadData.message || "Could not upload photo");
        savedPhotoUrl = `${apiBaseUrl}${uploadData.photoUrl}`;
      }
      const response = await fetch(`${apiBaseUrl}/api/admin/doctors${isNew ? "" : `/${record._id || record.id}`}`, { method: isNew ? "POST" : "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, specialty, clinicName, availableHours, gender, rating, photoUrl: savedPhotoUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save doctor");
      onSaved(data.doctor);
      onBack();
    } catch (error) { setMessage(error.message || "Could not save doctor"); } finally { setSaving(false); }
  }

  return <><header className="header"><button onClick={onBack}>‹</button><b>{isNew ? "Add doctor" : "Doctor details"}</b><span /></header><main className="admin-page doctor-detail-page"><section className="page-intro"><h1>{isNew ? "Add doctor" : "Edit doctor"}</h1><p>Update all public doctor information shown to PetCare customers.</p></section><section className="admin-detail-card"><label className="profile-photo" htmlFor="doctor-photo" style={{ backgroundImage: photoUrl ? `url(${photoUrl})` : "" }}><span>Change photo</span><input id="doctor-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} /></label><Field label="Doctor name" value={name} setValue={setName} /><Field label="Specialty" value={specialty} setValue={setSpecialty} /><Field label="Clinic name" value={clinicName} setValue={setClinicName} /><Field label="Available hours" value={availableHours} setValue={setAvailableHours} /><div className="split"><Field label="Gender" value={gender} setValue={setGender} choices={["Female", "Male"]} /><Field label="Rating (0.0–5.0)" type="number" min="0" max="5" step="0.1" value={rating} setValue={setRating} /></div>{message && <p className="auth-error">{message}</p>}<button className="button" disabled={saving} onClick={save}>{saving ? "Saving..." : isNew ? "Add doctor" : "Save doctor information"}</button></section></main></>;
}
