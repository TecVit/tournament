import React, { useState } from 'react';
import './css/Landing.css';

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
import { useNavigate } from 'react-router-dom';

export default function Landing() {

  const navigate = useNavigate();

  const handleInputNumero = (telefone) => {
    const formattedTelefone = telefone.replace(/\D/g, '');
    let formattedString = '';
    if (formattedTelefone.length > 10) {
        formattedString = `(${formattedTelefone.substring(0, 2)}) ${formattedTelefone.substring(2, 7)}-${formattedTelefone.substring(7, 11)}`;
    } else if (formattedTelefone.length > 6) {
        formattedString = `(${formattedTelefone.substring(0, 2)}) ${formattedTelefone.substring(2)}`;
    } else if (formattedTelefone.length > 2) {
        formattedString = `(${formattedTelefone.substring(0, 2)}) ${formattedTelefone.substring(2)}`;
    } else if (formattedTelefone.length > 0) {
        formattedString = `(${formattedTelefone}`;
    }
    setInputNumero(formattedString);
  };

  const formatarNome = (valor) => {
    valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
    valor = valor.trim().replace(/\s+/g, '-');
    valor = valor.toLowerCase();
    return valor;
};

  const games = [
    {
        name: "Minecraft",
        description: "Minecraft é um jogo de construção e exploração onde você cria e sobrevive em um mundo feito de blocos...",
        image: "https://seeklogo.com/images/M/minecraft-youtube-logo-448E10AC2B-seeklogo.com.png",
        link: "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&hl=pt_BR",
    },
    {
        name: "Roblox",
        description: "Roblox é uma plataforma de jogos online onde os usuários podem jogar uma variedade de minijogos...",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3WNETJxexNhu4Qi8ETL63gH2P5F4xXr5Lfg&s",
        link: "https://play.google.com/store/apps/details?id=com.roblox.client&hl=pt_BR",
    },
    {
        name: "Free Fire",
        description: "Free Fire é um jogo battle royale para mobile onde 50 jogadores competem para ser o último sobrevivente. As partidas são rápidas e exigem estratégia...",
        image: "https://i.pinimg.com/736x/f1/9b/1d/f19b1d45e7c033e4039b9f4bd638e1a7.jpg",
        link: "https://play.google.com/store/apps/details?id=com.dts.freefireth&hl=pt_BR",
    },
    {
        name: "Brawl Stars",
        description: "Brawl Stars é um jogo de batalha multiplayer onde equipes competem em diversos modos com personagens únicos, cada um com habilidades especiais...",
        image: "https://upload.wikimedia.org/wikipedia/pt/a/a4/Brawl_Stars_iOS_%C3%ADcone.jpg",
        link: "https://play.google.com/store/apps/details?id=com.supercell.brawlstars&hl=pt_BR",
    }
  ];

  const turmas = [
    "6ª Série A",
    "6ª Série B",
    "6ª Série C",
    "7ª Série A",
    "7ª Série B",
    "8ª Série A",
    "8ª Série B",
    "9ª Série A",
    "9ª Série B",
    "1ª Série A",
    "1ª Série B",
    "2ª Série A",
    "2ª Série B",
    "3ª Série A",
    "3ª Série B",
    "3ª Série C",
  ];


  const [mdNavbar, setMdNavbar] = useState(false);

  const [mdPopup, setMdPopup] = useState(false);
  const [mdErro, setMdErro] = useState(false);
  const [mdSuccess, setMdSuccess] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [infoInterclasse, setInfoInterclasse] = useState({});

  // Inputs
  const [inputGame, setInputGame] = useState('');
  const [inputNome, setInputNome] = useState('');
  const [inputTurma, setInputTurma] = useState('');
  const [inputNumero, setInputNumero] = useState('');
  const [inputRa, setInputRa] = useState('');

  const handleFazerInscricao = async () => {
    setCarregando(true);
    try {
        console.log(inputNumero.length);
        if (!inputGame || !inputNome || !inputTurma || !inputNumero || inputNumero && inputNumero.length < 15 || !inputRa) {
            setMdErro('Complete as informações corretamente');
            return;
        }
        setMdErro(false);
        const fazendo = await fazerInscricao(inputGame, inputNome, inputTurma, inputNumero, inputRa);
        if (fazendo) {
            setMdSuccess('Inscrição feita com sucesso');
            setInputGame('');
            setInputNome('');
            setInputTurma('');
            setInputNumero('');
            setInputRa('');
            setMdSuccess('');
            setMdErro('');
            setTimeout(() => {
                setMdPopup(false);
            }, 2500);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
  }


  return (
    <>
        <main className='container-landing'>

            {/* Navbar */}
            <header className='container-navbar'>
                <div className='content-navbar'>
                    <img onClick={() => window.location.href = "/"} className='logo' src={Logo} />
                    {!mdNavbar && (
                        <div className='links'>
                            <a href="/#">Início</a>
                            <a>Ao Vivo</a>
                            <a href="/#regras">Regras</a>
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
                            <a>Ao Vivo</a>
                            <a href="/#regras">Regras</a>
                            <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Inscrever-se</button>
                        </div>
                    </div>
                )}
            </header>
            
            {/* Principal */}
            <section className='content-landing'>
                <div className='text'>
                    <h1>Bem-Vindo ao nosso Interclasse de <strong>Games</strong></h1>
                    <p>As inscrições para o nosso interclasse de games estão oficialmente abertas! Junte-se a nós, forme sua equipe e prepare-se para competir nos jogos mais pedidos.</p>
                    <button className='btn-primary'>Quero Participar</button>
                    <button className='btn-secondary'>Saber Mais</button>
                </div>
            </section>

            {/* Games / Inscrições */}
            <section id='inscricoes' className='container-games'>
                <div id='regras' className='fita'>
                    {[0, 1, 2, 3, 4, 5, 6].map((val, index) => (
                        <div key={index} className='content'>
                            <IoIosStar className='icon' />
                            <p>Interclasse</p>
                            <IoIosStar className='icon' />
                            <p>Minecraft - dia 16 de setembro</p>
                            <IoIosStar className='icon' />
                            <p>Interclasse</p>
                            <IoIosStar className='icon' />
                            <p>Free Fire - dia 18 de setembro</p>
                        </div>
                    ))}
                </div>
                <div className='content-games'>
                    <div className='games'>
                        <h1>Jogue os Games Mais <strong>Votados</strong></h1>
                        <p>Confira a lista dos jogos que receberam as melhores avaliações e conquistaram os corações dos jogadores.</p>
                        <div className='list'>
                            {games.length > 0 && (
                                games.map((val, index) => (
                                    <div key={index} className='game'>
                                        <img src={val.image} />
                                        <p>{val.description}</p>
                                        <div className='linha'></div>
                                        <div className="flex">
                                            <button onClick={() => {
                                                setMdPopup(true);
                                                setInputGame(val.name);
                                                setInfoInterclasse(val);
                                            }}>Inscrever-se</button>
                                            <button onClick={() => window.location.href = `/regras/${formatarNome(val.name)}`}>Regras</button>
                                            <FaGlobe onClick={() => window.open(val.link)} className='icon' />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <img className='img-jogos' src={require('../image/games.png')} />
                </div>
            </section>

            <div className='linha-rgb'></div>
        </main>
                            

        {/* Popup */}
        {mdPopup && (
            <Popup>
                <div className='form'>
                    <div className='bar'>
                        <h1>Inscrever-se no Interclasse de <strong>{infoInterclasse.name}</strong></h1>
                        <IoClose onClick={() => setMdPopup(false)} className='icon' />
                    </div>
                    <div className='input'>
                        <IoPersonOutline className='icon'/>
                        <input onChange={(e) => setInputNome(e.target.value)} value={inputNome} placeholder='Seu nome completo' type='text' />    
                    </div>
                    <div className='input'>
                        <IoSchoolOutline className='icon'/>
                        <select onChange={(e) => setInputTurma(e.target.value)}>
                            <option>Selecione sua turma</option>
                            {turmas.length > 0 && (
                                turmas.map((val, index) => (
                                    <option key={index} value={val}>{val}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className='input'>
                        <IoPhonePortraitOutline className='icon' />
                        <input onChange={(e) => handleInputNumero(e.target.value)} value={inputNumero} placeholder='Seu número de Whatsapp' type='tel' />    
                    </div>
                    <div className='input'>
                        <PiIdentificationBadge className='icon' />
                        <input onChange={(e) => setInputRa(e.target.value)} value={inputRa} maxLength={16} placeholder='Seu registro de Aluno (RA)' type='text' />    
                    </div>
                    <button onClick={handleFazerInscricao}>Garantir minha Vaga</button>
                    {mdErro && (
                        <div className='erro'>
                            <IoMdInformationCircleOutline className='icon' />
                            <p>{mdErro}</p>
                        </div>
                    )}
                    {mdSuccess && (
                        <div className='success'>
                            <FaRegCircleCheck className='icon' />
                            <p>{mdSuccess}</p>
                        </div>
                    )}
                </div>
            </Popup>
        )}
    </>
  )
}