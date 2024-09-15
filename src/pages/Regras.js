import React, { useEffect, useState } from 'react';
import './css/Regras.css';

import Logo from '../image/logo.png';
import { FaGlobe } from 'react-icons/fa';

import Popup from '../components/Popup';
import { IoClose, IoPersonOutline, IoPhonePortraitOutline, IoSchoolOutline } from 'react-icons/io5';
import { PiIdentificationBadge } from 'react-icons/pi';
import { IoIosStar, IoMdInformationCircleOutline } from 'react-icons/io';
import { fazerInscricao } from '../firebase/inscricao';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import { coletarRegras } from '../firebase/regras';
import Navbar from '../components/Navbar';

export default function Regras() {

  const navigate = useNavigate();
  const params = useParams();
  const game = params.game;

  const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
  };

  // Modais
  const [mdNavbar, setMdNavbar] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [regras, setRegras] = useState('');

  const coletandoRegras = async () => {
    setCarregando(true);
    try {
        const regrasHtml = await coletarRegras(game);
        if (regrasHtml) {
            setRegras(regrasHtml);
        }
        return true;
    } catch (error) {
        console.log(error);
    } finally {
        setCarregando(false);
    }
  }

  useEffect(() => {
    if (!regras) {
        coletandoRegras();
    }
  }, []);

  return (
    <>
        <main className='container-regras'>

            {/* Navbar */}
            <Navbar />
            
            {/* Principal */}
            <section className='content-regras'>
                <div className='text'>
                    <h1>Regras Internas do Jogo <strong>{game}</strong></h1>
                    <p>É essencial ler e seguir as regras para garantir a sua chance de vitória no Interclasse. Respeitar as diretrizes é fundamental para uma competição justa e emocionante para todos os participantes.</p>
                </div>
            </section>

            {/* Games / Inscrições */}
            <section id='inscricoes' className='container-games'>
                <div className='content-games'>
                    {carregando && (
                        <div className='carregando'>
                            <div className='loader'></div>
                            <h1>Carregando</h1>
                        </div>
                    )}
                    {!carregando && regras ? (
                        <div dangerouslySetInnerHTML={{ __html: regras }} className='games' />
                    ) : !carregando && !regras ? (
                        <div className='games'>
                            <h1>Nenhuma regra encontrada</h1>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </section>

            <div className='linha-rgb'></div>
        </main>
    </>
  )
}