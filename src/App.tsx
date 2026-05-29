import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardPage from './pages/Dashboard';
import Drivers from './pages/Drivers';
import DriverMarket from './pages/DriverMarket';
import Garage from './pages/Garage';
import Facilities from './pages/Facilities';
import Calendar from './pages/Calendar';
import Finance from './pages/Finance';
import Manufacturer from './pages/Manufacturer';
import RaceStrategy from './pages/RaceStrategy';
import LiveRace from './pages/LiveRace';
import LiveRaceV2 from './pages/LiveRaceV2';
import { Dashboard } from './components/Dashboard';
import { BottomNav } from './components/BottomNav';
import { useState } from 'react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch(page) {
      case 'home':
        navigate('/');
        setActiveTab('home');
        break;
      case 'race':
        navigate('/calendar');
        setActiveTab('race');
        break;
      case 'market':
        navigate('/driver-market');
        setActiveTab('market');
        break;
      case 'settings':
        navigate('/facilities');
        setActiveTab('settings');
        break;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/driver-market" element={<DriverMarket />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/race-strategy/:raceId" element={<RaceStrategy />} />
        <Route path="/live-race/:raceId" element={<LiveRace />} />
        <Route path="/live-race-v2/:raceId" element={<LiveRaceV2 />} />
      </Routes>
      <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <AppContent />
      </Layout>
    </Router>
  );
}
