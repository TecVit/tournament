import React, { useEffect, useState } from 'react';
import './css/Alunos.css';

import Logo from '../../image/logo.png';
import { FaGlobe } from 'react-icons/fa';

import Popup from '../../components/Popup';

import { IoClose, IoPersonOutline, IoPhonePortraitOutline, IoSchoolOutline } from 'react-icons/io5';
import { PiIdentificationBadge } from 'react-icons/pi';
import { IoIosStar, IoMdInformationCircleOutline } from 'react-icons/io';
import { fazerInscricao } from '../../firebase/inscricao';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { coletarRegras } from '../../firebase/regras';
import Navbar from '../../components/Navbar';

import { clearCookies, getCookie, setCookie } from '../../firebase/cookies';
import { auth } from '../../firebase/login';

export default function Alunos() {

  const location = useLocation();
  const path = location.pathname;

  const uidCookie = getCookie('uid') || '';
  const emailCookie = getCookie('email') || '';
  
  const checkAdminStatus = async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken(true);
        const decodedToken = await auth.currentUser.getIdTokenResult();
        
        if (decodedToken.claims.admin) {
          return true;
        } else {
          return false
        }
      } catch (error) {
        return false;
      }
    }
  };

  useEffect(() => {
    if (uidCookie && emailCookie) {
      const unsubscribe = auth.onAuthStateChanged(async function(user) {
        if (!user) {
          await clearCookies();
          localStorage.clear();
          window.location.href = "/";
        } else {
          if (emailCookie !== user.email || uidCookie !== user.uid) {
            await clearCookies();
            localStorage.clear();
            window.location.href = "/";
          } else {
            const res = await checkAdminStatus(user);
            if (!res) {
              await clearCookies();
              localStorage.clear();
              window.location.href = "/";
            }
          }
        }
      });

      return () => unsubscribe();
    }
  }, [uidCookie, emailCookie]);


  const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
  };

  function formatAndCapitalize(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }

  // Modais
  const [mdNavbar, setMdNavbar] = useState(false);
  const [carregando, setCarregando] = useState(true);

  return (
    <>
        <main className='container-admin'>

            {/* Navbar */}
            <header className='navbar-top-admin'>
              <div className='content'>
                <img onClick={() => window.location.href = ""} src={Logo} />
                <div className='btns'>
                  <IoPersonOutline />
                </div>
              </div>
            </header>

            <header className='navbar-bottom-admin'>
              <div className='content'>
                <a className={path === "/admin/alunos" && 'atual'}>Alunos</a>
                <a>Jogos</a>
              </div>
            </header>
            
            {/* Principal */}
            <section className='container-alunos'>
                
                

            </section>
            
            <div className='linha-rgb'></div>
        </main>
    </>
  )
}