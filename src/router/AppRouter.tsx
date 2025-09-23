import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import CreateLeague from '../pages/CreateLeague';
import LeagueView from '../pages/LeagueView';
import LeagueAdmin from '../pages/admin/LeagueAdmin';
import MyLeagues from '../pages/admin/MyLeagues';
import MatchupsView from '../pages/MatchupsView';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        
        {/* Liga pública */}
        <Route path="/liga/:slug" element={<LeagueView />} />
        <Route path="/liga/:slug/enfrentamientos" element={<MatchupsView />} />
        
        {/* Admin (requiere auth - implementar ProtectedRoute después) */}
        <Route path="/crear-liga" element={<CreateLeague />} />
        <Route path="/admin/liga/:id" element={<LeagueAdmin />} />
        <Route path="/mis-ligas" element={<MyLeagues />} /> 
        <Route path="/admin/liga/:id" element={<LeagueAdmin />} />
        
        {/* 404 - Opcional */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
