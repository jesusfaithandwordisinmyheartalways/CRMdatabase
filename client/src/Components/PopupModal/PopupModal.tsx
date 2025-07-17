import React, { useState } from 'react';
import { Lead } from '../../Types/interface';
import { socket } from '../../WebSockets/socket';



const PopupModal: React.FC<{ close: () => void; lead?: Lead }> = ({ close, lead }) => {
  const [form, setForm] = useState<Lead>({
    name: '',
    email: '',
    phone: '',
    status: 'HOT',
    notes: '',
    ...(lead || {}),
  });



  

  const handleSubmit = async () => {
    if (form.notes.split(' ').length > 50) return alert('Max 50 words allowed!');
    const method = lead ? 'PUT' : 'POST';
    const url = lead
      ? `https://crmdatabaseserver.onrender.com/api/leads/update-lead/${lead._id}`
      : 'https://crmdatabaseserver.onrender.com/api/leads/create-lead';
  
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  
    socket.emit('updateNotes'); 
    close(); 
  };





  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-4 rounded flex flex-col gap-2">
        <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Lead['status'] })}>
          <option value="HOT">HOT</option>
          <option value="COLD">COLD</option>
          <option value="PROSPECT">PROSPECT</option>
          <option value="NATURE">NATURE</option>
        </select>
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Save</button>
          <button onClick={close} className="bg-gray-300 p-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};





export default PopupModal;
