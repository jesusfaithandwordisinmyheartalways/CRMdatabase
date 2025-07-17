import React, { useEffect, useState } from 'react';
import { Lead } from '../../Types/interface';
import './AgentDashboard.css'





const AgentDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch('http://localhost:3001/api/leads/retrieve/all');
      const data = await res.json();
      setLeads(data);
    };
    fetchAll();
  }, []);




  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Pipeline Overview</h2>
      {leads.map((lead, idx) => (
        <div key={idx} className="p-2 border mt-2">
          <b>{lead.name}</b> - {lead.status}
        </div>
      ))}
    </div>
  );
};




export default AgentDashboard;