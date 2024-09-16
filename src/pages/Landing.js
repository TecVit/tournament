import React, { useEffect, useState } from 'react';
import './css/Landing.css';

import Logo from '../image/logo.png';
import { FaGlobe } from 'react-icons/fa';

import Popup from '../components/Popup';
import { IoClose, IoLogoWhatsapp, IoMail, IoMailOutline, IoPersonOutline, IoPhonePortraitOutline, IoSchoolOutline } from 'react-icons/io5';
import { PiIdentificationBadge } from 'react-icons/pi';
import { IoIosStar, IoMdInformationCircleOutline } from 'react-icons/io';
import { fazerInscricao } from '../firebase/inscricao';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

import { coletarRankings } from '../firebase/ranking';
import { coletarChaveamentos } from '../firebase/chaveamento';

import { NotificationContainer, notifyError, notifySuccess } from '../toastifyServer';
import Navbar from '../components/Navbar';


// Images
import minecraftImage from '../image/minecraft.png';
import brawlImage from '../image/brawl.png';
import freefireImage from '../image/freefire.png';
import robloxImage from '../image/roblox.png';

export default function Landing() {

  const navigate = useNavigate();

  /*const handleInputNumero = (telefone) => {
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
  };*/

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
        image: minecraftImage,
        link: "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&hl=pt_BR",
    },
    {
        name: "Roblox",
        description: "Roblox é uma plataforma de jogos online onde os usuários podem jogar uma variedade de minijogos...",
        image: robloxImage,
        link: "https://play.google.com/store/apps/details?id=com.roblox.client&hl=pt_BR",
    },
    {
        name: "Free Fire",
        description: "Free Fire é um jogo battle royale para mobile onde 50 jogadores competem para ser o último sobrevivente. As partidas são rápidas e exigem estratégia...",
        image: freefireImage,
        link: "https://play.google.com/store/apps/details?id=com.dts.freefireth&hl=pt_BR",
    },
    {
        name: "Brawl Stars",
        description: "Brawl Stars é um jogo de batalha multiplayer onde equipes competem em diversos modos com personagens únicos, cada um com habilidades especiais...",
        image: brawlImage,
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

  // Modais
  const [mdPopup, setMdPopup] = useState(false);
  const [mdErro, setMdErro] = useState(false);
  const [mdSuccess, setMdSuccess] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [infoInterclasse, setInfoInterclasse] = useState({});

  const [rankingTurmas, setRankingTurmas] = useState([]);
  const [rankingAlunos, setRankingAlunos] = useState([]);

  // Inputs
  const [inputGame, setInputGame] = useState('');
  const [inputNome, setInputNome] = useState('');
  const [inputTurma, setInputTurma] = useState('');
  const [inputEmail, setInputEmail] = useState('');

  const [paginaTurmas, setPaginaTurmas] = useState(1);
  const [paginaAlunos, setPaginaAlunos] = useState(1);
  const itensPorPagina = 8;


  const handleFazerInscricao = async () => {
    setCarregando(true);
    try {
        if (!inputGame || !inputNome || !inputTurma || !inputEmail) {
            notifyError('Complete as informações corretamente');
            setMdErro('Complete as informações corretamente');
            return;
        }
        setMdErro(false);
        const fazendo = await fazerInscricao(inputGame, inputNome, inputTurma, inputEmail);
        if (fazendo) {
            notifySuccess('Inscrição feita com sucesso');
            setMdSuccess('Inscrição feita com sucesso');
            setInputGame('');
            setInputNome('');
            setInputTurma('');
            setInputEmail('');
            setMdErro('');
            setTimeout(() => {
                setMdPopup(false);
                setMdSuccess('');
            }, 3850);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
  }

  useEffect(() => {
    const coletandoRanking = async () => {
      setCarregando(true);
      try {
        const { rankingTurmasList, rankingAlunosList } = await coletarRankings() || {};
        if (Object.keys(rankingTurmasList).length > 0) {
          setRankingTurmas(rankingTurmasList);
        }
        if (Object.keys(rankingAlunosList).length > 0) {
            setRankingAlunos(rankingAlunosList);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        setCarregando(false);
      }
    };
  
    coletandoRanking();
  
    const intervalId = setInterval(() => {
      coletandoRanking();
    }, 60000); // 60.000 ms = 1 minuto
  
    return () => clearInterval(intervalId);
  }, []);
  
  const indexOfLastItemTurmas = paginaTurmas * itensPorPagina;
  const indexOfFirstItemTurmas = indexOfLastItemTurmas - itensPorPagina;
  const currentItemsTurmas = rankingTurmas.slice(indexOfFirstItemTurmas, indexOfLastItemTurmas);

  const indexOfLastItemAlunos = paginaAlunos * itensPorPagina;
  const indexOfFirstItemAlunos = indexOfLastItemAlunos - itensPorPagina;
  const currentItemsAlunos = rankingAlunos.slice(indexOfFirstItemAlunos, indexOfLastItemAlunos);

  const topTurmas = {
    0: "Pos",
    1: "Turma",
    2: "P",
    3: "V",
    4: "D",
    5: "PTS",
  };
  
  const topAlunos = {
    0: "Pos",
    1: "Aluno",
    2: "P",
    3: "V",
    4: "D",
    5: "PTS",
  };

  /* Chaveamento */
  const [chaveamentos, setChaveamentos] = useState([]);

  useEffect(() => {
    const lerChaveamentos = async () => {
        setCarregando(true);
        try {
            const chaveamentosList = await coletarChaveamentos();
            if (chaveamentosList.length > 0) {
                setChaveamentos(chaveamentosList);
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setCarregando(false);
        }
    }
    lerChaveamentos();
  }, []);

  return (
    <>
        <main className='container-landing'>
            <NotificationContainer />

            {/* Navbar */}
            <Navbar />

            {/* Principal */}
            <section className='content-landing'>
                <div className='text'>
                    <h1>Bem-Vindo ao nosso Interclasse de <strong>Games</strong></h1>
                    <p>As inscrições para o nosso interclasse de games estão oficialmente abertas! Junte-se a nós, forme sua equipe e prepare-se para competir nos jogos mais pedidos.</p>
                    <button onClick={() => window.location.href = "/#inscricoes"} className='btn-primary'>Quero Participar</button>
                    <button className='btn-secondary'>Assistir Ao Vivo</button>
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
                            <p>Minecraft - dia X de outubro</p>
                            <IoIosStar className='icon' />
                            <p>Interclasse</p>
                            <IoIosStar className='icon' />
                            <p>Free Fire - dia X de outubro</p>
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
                                        <img src={val.image} alt={val.name} />
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

            {/* Ranking das Turmas */}
            <section id='ranking' className='container-ranking'>
                <div className='content-ranking'>
                    <h1>Ranking <strong>Ao Vivo</strong> das Turmas</h1>
                    <p>Veja o ranking ao vivo das turmas e descubra quais são os jogos mais populares e bem avaliados no momento!</p>    
                    <div className='tabela'>
                        <div className='linha one'>
                            {Object.keys(topTurmas).map((key, i) => (
                                <div key={i} className='coluna'>
                                    <p>{topTurmas[key]}</p>
                                </div>
                            ))}
                        </div>
                        {currentItemsTurmas.length > 0 ? (
                            currentItemsTurmas.map((obj, i) => (
                                <div key={i} className="linha">
                                    {Object.keys(obj).map((key, j) => {
                                        if (j === 0 && obj[key] === null) {
                                            return (
                                                <div key={j} className='coluna'>
                                                    <p>{i+1}</p>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={j} className='coluna'>
                                                <p>{obj[key]}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className='linha'>
                                <div className='coluna'>
                                    <p>Nenhuma turma acumulou pontos até o momento.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='pagination'>
                        <button onClick={() => setPaginaTurmas(paginaTurmas > 1 ? paginaTurmas - 1 : 1)}>Anterior</button>
                        <p>Página {paginaTurmas} de {Math.ceil(rankingTurmas.length / itensPorPagina)}</p>
                        <button onClick={() => setPaginaTurmas(paginaTurmas < Math.ceil(rankingTurmas.length / itensPorPagina) ? paginaTurmas + 1 : paginaTurmas)}>Próxima</button>
                    </div>
                </div>
            </section>

            {/* Ranking dos Alunos */}
            <section id='ranking' className='container-ranking'>
                <div className='content-ranking'>
                    <h1>Ranking <strong>Ao Vivo</strong> dos Alunos</h1>
                    <p>Confira a classificação atualizada em tempo real de cada aluno que está se destacando nos jogos mais pedidos.</p>
                    <div className='tabela'>
                        <div className='linha one'>
                            {Object.keys(topAlunos).map((key, i) => (
                                <div key={i} className='coluna'>
                                    <p>{topAlunos[key]}</p>
                                </div>
                            ))}
                        </div>
                        {currentItemsAlunos.length > 0 ? (
                            currentItemsAlunos.map((obj, i) => (
                                <div key={i} className="linha">
                                    {Object.keys(obj).map((key, j) => {
                                        if (j === 0 && obj[key] === null) {
                                            return (
                                                <div key={j} className='coluna'>
                                                    <p>{i+1}</p>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={j} className='coluna'>
                                                <p>{obj[key]}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className='linha'>
                               <div className='coluna'>
                                    <p>Nenhum aluno acumulou pontos até o momento.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='pagination'>
                        <button onClick={() => setPaginaAlunos(paginaAlunos > 1 ? paginaAlunos - 1 : 1)}>Anterior</button>
                        <p>Página {paginaAlunos} de {Math.ceil(rankingAlunos.length / itensPorPagina)}</p>
                        <button onClick={() => setPaginaAlunos(paginaAlunos < Math.ceil(rankingAlunos.length / itensPorPagina) ? paginaAlunos + 1 : paginaAlunos)}>Próxima</button>
                    </div>
                </div>
            </section>

            {/* Chaveamento do Brawl Stars */}
            <section id='chaveamento' className='container-chaveamento'>
                <div className='content-chaveamento'>
                    {chaveamentos.length > 0 && (
                        chaveamentos.map((val, index) => (
                            <>
                                <h1>Chaveamento do <strong>{val.game}</strong></h1>
                                <p>Acompanhe o chaveamento atualizado do <strong>{val.game}</strong> e veja quais equipes estão avançando nas rodadas.</p>
                                <div className='chaves'>
                                <div className='top'>
                                        <div className='grupo'>
                                            {val.grupo1 && val.grupo1.length > 0 && (
                                              val.grupo1.map((turma, j) => (
                                                <div className='turma'>
                                                    <p>{turma}</p>
                                                </div>
                                              ))
                                            )}
                                        </div>
                                        <div className='grupo quartas'>
                                            <div className='turma'>
                                                <p>{val['semi1-2'] ? val['semi1-2'][0] : 'Semi-Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo semi'>
                                            <div className='turma'>
                                                <p>{val['final'] ? val['final'][0] : 'Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo quartas'>
                                            <div className='turma'>
                                                <p>{val['semi1-2'] ? val['semi1-2'][1] : 'Semi-Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo'>
                                            {val.grupo2 && val.grupo2.length > 0 && (
                                              val.grupo2.map((turma, j) => (
                                                <div className='turma'>
                                                    <p>{turma}</p>
                                                </div>
                                              ))
                                            )}
                                        </div>
                                    </div>
                                    <div className='bottom'>
                                        <div className='grupo'>
                                            {val.grupo3 && val.grupo3.length > 0 && (
                                              val.grupo3.map((turma, j) => (
                                                <div className='turma'>
                                                    <p>{turma}</p>
                                                </div>
                                              ))
                                            )}
                                        </div>
                                        <div className='grupo quartas'>
                                            <div className='turma'>
                                                <p>{val['semi3-4'] ? val['semi3-4'][0] : 'Semi-Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo semi'>
                                            <div className='turma'>
                                                <p>{val['final'] ? val['final'][1] : 'Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo quartas'>
                                            <div className='turma'>
                                                <p>{val['semi3-4'] ? val['semi3-4'][1] : 'Semi-Final'}</p>
                                            </div>
                                        </div>
                                        <div className='grupo'>
                                            {val.grupo4 && val.grupo4.length > 0 && (
                                              val.grupo4.map((turma, j) => (
                                                <div className='turma'>
                                                    <p>{turma}</p>
                                                </div>
                                              ))
                                            )}
                                        </div>
                                    </div>
                                </div>  
                            </>
                        ))
                    )}
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
                        <input onChange={(e) => setInputNome(e.target.value)} value={inputNome} placeholder='Nome do Aluno' type='text' />    
                    </div>
                    <div className='input'>
                        <IoMailOutline className='icon' />
                        <input onChange={(e) => setInputEmail(e.target.value)} value={inputEmail} placeholder='Email do Aluno' type='text' />    
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
