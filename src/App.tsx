import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Garage from './pages/Garage';
import Facilities from './pages/Facilities';
import Calendar from './pages/Calendar';
import Finance from './pages/Finance';
import Manufacturer from './pages/Manufacturer';
import RaceStrategy from './pages/RaceStrategy';
import LiveRace from './pages/LiveRace';
import LiveRaceV2 from './pages/LiveRaceV2';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/manufacturer" element={<Manufacturer />} />
          <Route path="/race-strategy/:raceId" element={<RaceStrategy />} />
          <Route path="/live-race/:raceId" element={<LiveRace />} />
          <Route path="/live-race-v2/:raceId" element={<LiveRaceV2 />} />
        </Routes>
      </Layout>
    </Router>
  );
}
