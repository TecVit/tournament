import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';

// Erros
import Error404 from './pages/errors/404';

import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase/login';
import { clearCookies, deleteCookie, getCookie, setCookie } from './firebase/cookies';

const RouterApp = () => {

  // Dados
  const uidCookie = getCookie('uid') || '';
  const nickCookie = getCookie('nick') || '';
  const emailCookie = getCookie('email') || '';
  
  if (uidCookie && emailCookie && nickCookie) {
    auth.onAuthStateChanged( async function(user) {
      if (!user) {
        await clearCookies();
        localStorage.clear();
        window.location.href = "/entrar";
      } else {
        if (emailCookie !== user.email || uidCookie !== user.uid || nickCookie !== user.displayName) {
          await clearCookies();
          localStorage.clear();
          window.location.href = "/entrar";
        }
      }
    });
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </Router>
  );

}

export default RouterApp;