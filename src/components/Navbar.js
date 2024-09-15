import React, { useEffect, useState } from 'react'
import './css/Navbar.css';
import Logo from '../image/logo.png';
import { IoClose } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function Navbar() {
  
  const [mdNavbar, setMdNavbar] = useState(false);

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
                        <a href='/#ao-vivo'>Ao Vivo</a>
                        <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Inscrever-se</button>
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
                        <a href='/#ao-vivo'>Ao Vivo</a>
                        <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Inscrever-se</button>
                    </div>
                </div>
            )}
        </header>
    </>
  )
}
