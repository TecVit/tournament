import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import Regras from './pages/Regras';
import Alunos from './pages/admin/Alunos';


// Erros
import Error404 from './pages/errors/404';

import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase/login';
import { clearCookies, deleteCookie, getCookie, setCookie } from './firebase/cookies';

const RouterApp = () => {

  // Dados
  const uidCookie = getCookie('uid') || '';
  const emailCookie = getCookie('email') || '';
  
  useEffect(() => {
    if (uidCookie && emailCookie) {
      auth.onAuthStateChanged( async function(user) {
        if (!user) {
          await clearCookies();
          localStorage.clear();
          window.location.href = "/";
        } else {
          if (emailCookie !== user.email || uidCookie !== user.uid) {
            await clearCookies();
            localStorage.clear();
            window.location.href = "/";
          }
        }
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/regras/:game" element={<Regras />} />

        {/* Admin */}
        <Route path="/admin/alunos" element={<Alunos />} />
        
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </Router>
  );

}

export default RouterApp;