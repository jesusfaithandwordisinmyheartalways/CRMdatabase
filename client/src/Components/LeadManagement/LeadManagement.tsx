import React, { useEffect, useState, useCallback } from 'react';
import { Lead } from '../../Types/interface';
import { socket } from '../../WebSockets/socket';
import PopupModal from '../PopupModal/PopupModal';

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);

  const leadsPerPage = 3;

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('https://crmdatabaseserver.onrender.com/api/leads/retrieve/all');
      const data = await res.json();
      setLeads(data);
      // Save to localStorage in case you want to persist
      localStorage.setItem('leads', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      // Optionally, load from localStorage only if fetch fails
      const stored = localStorage.getItem('leads');
      if (stored) setLeads(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    socket.on('notesUpdated', fetchLeads);
    return () => {
      socket.off('notesUpdated', fetchLeads);
    };
  }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    try {
      await fetch(`https://crmdatabaseserver.onrender.com/api/leads/delete-lead/${id}`, { method: 'DELETE' });
      fetchLeads();
      socket.emit('updateNotes'); // emit event so other clients update
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const filtered = leads.filter((l) =>
    [l.name, l.email, l.phone, l.status].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginated = filtered.slice((page - 1) * leadsPerPage, page * leadsPerPage);

  return (
    <div className="px-4 mt-4 w-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSelectedLead(null);
            setModalVisible(true);
          }}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Lead
        </button>
        <input
          className="p-1 border"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {paginated.map((lead) => (
        <div key={lead._id} className="border p-3 my-2 rounded shadow-md">
          <div><b>Name:</b> {lead.name}</div>
          <div><b>Email:</b> {lead.email}</div>
          <div><b>Phone:</b> {lead.phone}</div>
          <div><b>Status:</b> {lead.status}</div>
          <textarea
            value={lead.notes}
            onChange={async (e) => {
              await fetch(`https://crmdatabaseserver.onrender.com/api/leads/update-lead/${lead._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: e.target.value }),
              });
              socket.emit('updateNotes');
            }}
            className="w-full mt-2 border p-1"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => deleteLead(lead._id!)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedLead(lead);
                setModalVisible(true);
              }}
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        {Array.from({ length: Math.ceil(filtered.length / leadsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-2 py-1 rounded ${
              page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {modalVisible && (
        <PopupModal
          close={() => {
            setModalVisible(false);
            fetchLeads(); // refetch leads after modal closes (add/edit)
          }}
          lead={selectedLead ?? undefined}
        />
      )}
    </div>
  );
};

export default LeadManagement;
