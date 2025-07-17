import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeadManagement from './Components/LeadManagement/LeadManagement';
import AgentDashboard from './Components/AgentDashboard/AgentDashboard';



const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-6">CRM SaaS Dashboard</h1>
        <Routes>
          <Route path="/" element={<LeadManagement />} />
          <Route path="/dashboard" element={<AgentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;