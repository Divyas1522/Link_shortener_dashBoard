import React from 'react';
import { Route, Routes, } from 'react-router-dom';
import Login from './pages/Login';
import MyLinks from './pages/MyLinks';
import Dashboard from './pages/DashBoard';
import CreateLink from './pages/CreateLink';
import DashboardContent from './pages/DashboardContent';
import Analytics from './pages/Analytics';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardContent />} />
        <Route path="links" element={<MyLinks />} />
        <Route path="create" element={<CreateLink />} />
        <Route path='analytics' element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default App;