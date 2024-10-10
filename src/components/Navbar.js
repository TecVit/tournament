import React, { useEffect, useState } from 'react'
import './css/Navbar.css';
import Logo from '../image/logo.png';
import { IoClose, IoMailOpen, IoMailOutline, IoPersonOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import Popup from './Popup';
import { CgPassword } from 'react-icons/cg';
import { MdLockOutline } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { entrarAdmin, entrarComEmail, entrarComGoogle } from '../firebase/login';
import { notifyError, notifySuccess } from '../toastifyServer';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash;

  
  // Modais
  const [mdNavbar, setMdNavbar] = useState(false);
  const [mdPopupEntrar, setMdPopupEntrar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Inputs
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleEntrar = async () => {
    setCarregando(true);
    try {

      if (carregando) {
        notifyError('Por favor, aguarde um momento');
        return;
      }
      if (!email || !senha) {
        notifyError('Por favor, insira suas informações corretamente');
        return;
      }
      if (senha && senha.length < 6) {
        notifyError('Por favor, insira uma senha com mais de 6 caracteres');
        return;
      }
      
      const entrando = await entrarAdmin(email, senha);
      if (entrando === 'sucesso') {
        notifySuccess('Usuário logado com sucesso');
        setTimeout(() => {
          window.location.href = "/admin/alunos";
        }, 3750);
        return;
      } else if (entrando === 'email-invalido') {
        notifyError('Email inválido');
        return;
      } else if (entrando === 'email-em-uso') {
        notifyError('Email já está em uso');
        return;
      } else if (entrando === 'nome-de-usuario-em-uso') {
        notifyError('Nome de usuário já está em uso');
        return;
      } else if (entrando === 'credenciais-invalidas') {
        notifyError('Credenciais Inválidas');
        return;
      } else {
        notifyError('Houve um erro');
        return;
      }
      
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setCarregando(false);
    }
  }

  const entrarGoogle = async () => {
    setCarregando(true);
    try {

      if (carregando) {
        notifyError('Por favor, aguarde um momento');
        return;
      }
      
      const entrando = await entrarComGoogle();
      if (entrando === 'sucesso') {
        notifySuccess('Usuário logado com sucesso');
        setTimeout(() => {
          window.location.href = "/admin/alunos";
        }, 3750);
        return;
      } else if (entrando === 'email-invalido') {
        notifyError('Email inválido');
        return;
      } else if (entrando === 'email-em-uso') {
        notifyError('Email já está em uso');
        return;
      } else if (entrando === 'nome-de-usuario-em-uso') {
        notifyError('Nome de usuário já está em uso');
        return;
      } else if (entrando === 'credenciais-invalidas') {
        notifyError('Credenciais Inválidas');
        return;
      } else if (entrando === 'popup-fechou') {
        notifyError('O Popup foi fechado, tente novamente');
        return;
      } else {
        notifyError('Houve um erro');
        return;
      }
      
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setCarregando(false);
    }
  }


  return (
    <>    
        {/* Navbar */}
        <header className='container-navbar'>
            <div className='content-navbar'>
                <img onClick={() => window.location.href = "/"} className='logo' src={Logo} />
                {!mdNavbar && (
                    <div className='links'>
                        <a href="/#">Início</a>
                        <a href="/#regras">Regras</a>
                        <a href='/#ranking'>Ranking</a>
                        <a href='/#chaves'>Chaves</a>
                        <a href='/#calendario'>Calendário</a>
                        <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Inscrever-se</button>
                        <button onClick={() => setMdPopupEntrar(true)} className='btn-secondary'>
                            <IoPersonOutline className='icon' />
                            Entrar
                        </button>
                    </div>
                )}
                {mdNavbar ? (
                    <IoClose onClick={() => setMdNavbar(false)} className='btn btn-close' />
                ) : (
                    <RxHamburgerMenu onClick={() => setMdNavbar(true)} className='btn btn-open' />
                )}
            </div>
            {mdNavbar && (
                <div className='content-navbar-mobile'>
                    <div className='links'>
                        <a href="/#">Início</a>
                        <a href="/#regras">Regras</a>
                        <a href='/#ranking'>Ranking</a>
                        <a href='/#chaves'>Chaves</a>
                        <a href='/#calendario'>Calendário</a>
                        <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Inscrever-se</button>
                        <button onClick={() => setMdPopupEntrar(true)} className='btn-secondary'>
                            <IoPersonOutline className='icon' />
                            Entrar
                        </button>
                    </div>
                </div>
            )}
        </header>

        {/* Popup - Entrar */}
        {mdPopupEntrar && (
            <Popup>
                <div className='form'>
                    <div className='bar'>
                        <h1>Entrar na conta de <strong>Administrador</strong></h1>
                        <IoClose onClick={() => setMdPopupEntrar(false)} className='icon' />
                    </div>
                    <div className='input'>
                        <IoMailOutline className='icon' />
                        <input onChange={(e) => setEmail(e.target.value)} placeholder='Seu email' type='text' />
                    </div>
                    <div className='input'>
                        <MdLockOutline className='icon' />
                        <input onChange={(e) => setSenha(e.target.value)} placeholder='Sua senha' type='password' />
                    </div>
                    <div className='ou'>
                        <div></div>
                        <p>Ou</p>
                        <div></div>
                    </div>
                    <button onClick={entrarGoogle} className='google'>
                        <FcGoogle className='icon' />
                        Entrar com Google
                    </button>
                    <button onClick={handleEntrar}>Entrar</button>
                </div>
            </Popup>
        )}
    </>
  )
}
