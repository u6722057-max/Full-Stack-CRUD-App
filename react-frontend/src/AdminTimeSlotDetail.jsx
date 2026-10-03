import React, { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AdminTimeSlotDetail({ slot, onBack, onSaved }) {
  const [time, setTime] = useState(slot?.time || "09:00");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const isNew = !slot;
  async function save(event) {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/time-slots${isNew ? "" : `/${slot._id}`}`, { method: isNew ? "POST" : "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ time }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save time slot");
      onSaved(data.timeSlot);
      onBack();
    } catch (error) { setMessage(error.message || "Could not save time slot"); } finally { setSaving(false); }
  }
  return <><header className="header"><button onClick={onBack}>‹</button><b>{isNew ? "Add time slot" : "Edit time slot"}</b><span /></header><main className="admin-page time-slot-detail-page"><section className="page-intro"><h1>{isNew ? "New booking time" : "Edit booking time"}</h1><p>This time will be available to customers in the appointment booking page.</p></section><form className="admin-detail-card" onSubmit={save}><label className="field"><small>Appointment time</small><input type="time" value={time} onChange={event => setTime(event.target.value)} required /></label>{message && <p className="auth-error">{message}</p>}<button className="button" disabled={saving}>{saving ? "Saving..." : "Save time slot"}</button></form></main></>;
}
