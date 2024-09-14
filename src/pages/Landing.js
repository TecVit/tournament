import React from 'react';
import './css/Landing.css';

import Logo from '../image/logo.png';
import { FaGlobe } from 'react-icons/fa';

export default function Landing() {

  const games = [
    {
        name: "Minecraft",
        description: "Minecraft é um jogo de construção e exploração onde você cria e sobrevive em um mundo feito de blocos...",
        image: "https://seeklogo.com/images/M/minecraft-youtube-logo-448E10AC2B-seeklogo.com.png",
        link: "https://www.minecraft.net/pt-br",
    },
    {
        name: "Roblox",
        description: "Roblox é uma plataforma de jogos online onde os usuários podem criar, compartilhar e jogar uma variedade de jogos feitos por outros jogadores...",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3WNETJxexNhu4Qi8ETL63gH2P5F4xXr5Lfg&s",
        link: "https://www.roblox.com/pt",
    },
    {
        name: "Free Fire",
        description: "Free Fire é um jogo battle royale para mobile onde 50 jogadores competem para ser o último sobrevivente. As partidas são rápidas e exigem estratégia...",
        image: "https://i.pinimg.com/736x/f1/9b/1d/f19b1d45e7c033e4039b9f4bd638e1a7.jpg",
        link: "https://ff.garena.com/pt/",
    }
  ]


  return (
    <main className='container-landing'>

        {/* Navbar */}
        <header className='container-navbar'>
            <div className='content-navbar'>
                <img onClick={() => window.location.href = ""} className='logo' src={Logo} />
                <div className='links'>
                    <a>Games</a>
                    <a>Informações</a>
                    <button className='btn-primary'>Inscrição</button>
                </div>
            </div>
        </header>
        
        {/* Principal */}
        <section className='content-landing'>
            <div className='text'>
                <h1>Bem-Vindo ao nosso Interclasse de <strong>Games</strong></h1>
                <p>As inscrições para o nosso interclasse de games estão oficialmente abertas! Junte-se a nós, forme sua equipe e prepare-se para competir nas modalidades mais empolgantes.</p>
                <button className='btn-primary'>Quero Participar</button>
                <button className='btn-secondary'>Saber Mais</button>
            </div>
        </section>

        {/* Games */}
        <section className='container-games'>
            <div className='content-games'>
                <div className='games'>
                    <h1>Jogue os Games Mais <strong>Votados</strong></h1>
                    <p>Confira a lista dos jogos que receberam as melhores avaliações e conquistaram os corações dos jogadores.</p>
                    <div className='list'>
                        {games.map((val, index) => (
                            <div className='game'>
                                <img src={val.image} />
                                <p>{val.description}</p>
                                <div className='linha'></div>
                                <div className="flex">
                                    <button>Inscrever-se</button>
                                    <FaGlobe onClick={() => window.open(val.link)} className='icon' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <img src={require('../image/games.png')} />
            </div>
        </section>

        <div className='linha-rgb'></div>
    </main>
  )
}