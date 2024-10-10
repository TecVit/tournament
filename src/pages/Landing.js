import React, { useEffect, useState } from 'react';
import './css/Landing.css';

import Logo from '../image/logo.png';
import { FaArrowLeft, FaArrowRight, FaGlobe } from 'react-icons/fa';

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
import csImage from '../image/cs.png';
import clashroyaleImage from '../image/clashroyale.png';
import { firestore } from '../firebase/login';
import { coletarCalendario } from '../firebase/calendario';

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
        link: "https://www.minecraft.net/pt-br",
    },
    {
        name: "Counter Strike",
        description: "Counter-Strike é um jogo de tiro em primeira pessoa focado em combate tático e trabalho em equipe...",
        image: csImage,
        link: "https://store.steampowered.com/app/10/CounterStrike/",
    },
    {
        name: "Clash Royale",
        description: "Entre na arena! Monte seu deck de batalha e leve a melhor em disputas rápidas em tempo real.",
        image: clashroyaleImage,
        link: "https://play.google.com/store/apps/details?id=com.supercell.clashroyale",
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
    },
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
  const [mdPopupAlert, setMdPopupAlert] = useState(false);
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


  // Ativa o Alert
  useEffect(() => {
    setMdPopupAlert(true);
  }, []);
 


  // Calendario
  function getFirstDayOfMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    return date.getDay();
  }

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();

  const eventos = [
    {
        jogo: "Free Fire",
        fase: "Quartas de Finais",
        horario: "10h às 11h55",
        resultado: null,
        cor: "#002242"
    },
    {
        jogo: "Minecraft",
        fase: "Semi-Final",
        horario: "10h às 11h55",
        resultado: null,
        cor: "#144774"
    }
  ];

  const namesDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  // Coletar Calendario
  const [calendar, setCalendar] = useState([]);
  const [calendarIndex, setCalendarIndex] = useState(month);
  
  useEffect(() => {
    const consultarCalendario = async () => {
        try {
            const response = await coletarCalendario();
            if (response.length > 0) {
                setCalendar(response);
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    consultarCalendario();
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
                    <button onClick={() => setMdPopupAlert(true)} className='btn-secondary'>Atualizações</button>
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
                                                <p className={j === 1 && 'nome'}>{obj[key]}</p>
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
            {chaveamentos.length > 0 && (
                <section id='chaves' className='container-chaveamento'>
                    <div className='content-chaveamento'>
                        {chaveamentos.map((val, index) => (
                            <>
                                <h1>Chaveamento do <strong>{val.game}</strong> do Ensino {val.ensino}</h1>
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
                        ))}

                    </div>
                </section>
            )}
            

            {/* Calendario e Eventos */}
            <section id='calendario' className="container-calendar">
                <div className="content-calendar">
                    <h1 className='titulo'>Calendário de <strong>Eventos</strong> do nosso <strong>Interclasse</strong> de {year}</h1>
                    <p className='subtitulo'>Confira a programação atualizada em tempo real de todos os eventos mais esperados.</p>
                    
                    {calendar.length > 0 && (
                        <>

                            {/* Calendario */}
                            {calendar.map((val, index) => {
                                if (index === calendarIndex) {
                                    return (
                                        <div className="calendar">

                                            <div className='title'>
                                                <h1>Calendário: {val.mes} de {year}</h1>
                                                <div className='btns'>
                                                    <FaArrowLeft onClick={() => {
                                                        if (calendarIndex-1 < 0) {
                                                            setCalendarIndex(11);
                                                        } else {
                                                            setCalendarIndex(calendarIndex - 1);
                                                        }
                                                    }} className='seta' />
                                                    <FaArrowRight onClick={() => {
                                                        if (calendarIndex + 1 > 11) {
                                                            setCalendarIndex(0);
                                                        } else {
                                                            setCalendarIndex(calendarIndex + 1);
                                                        }
                                                    }} className='seta' />
                                                </div>
                                            </div>

                                            <div className='table'>

                                                {namesDays.length > 0 && (
                                                    namesDays.map((nameDay, i) => (
                                                        <div className='day name-day'>
                                                            <p>{nameDay}</p>
                                                        </div>
                                                    ))
                                                )}

                                                {/* Dias Vazios até chegar no inicio do mes */}
                                                {Array.from({ length: val.firstDay }).map((_, idx) => (
                                                    <div key={`empty-${idx}`} className='day empty'>
                                                    </div>
                                                ))}

                                                {val.dias.length > 0 && (
                                                    val.dias.map((dia, j) => {
                                                        return (
                                                            <div className='day'>
                                                                {j+1}
                                                                <div className='events'>
                                                                    {dia.eventos.length > 0 && (
                                                                        dia.eventos.map((evento, k) => {
                                                                            if (evento.disponivel !== false && evento.disponivel !== null && evento.disponivel !== undefined) {
                                                                                return (
                                                                                    <p onClick={() => window.location.href = `/#evento#${j+1}#${k+1}`} key={k} style={{ background: evento.cor }}> {k+1} </p>
                                                                                )
                                                                            }
                                                                        })
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}

                                            </div>
                                        </div>
                                    )
                                }
                            })}

                            {/* Eventos */}
                            {calendar.map((val, index) => {
                                if (index === calendarIndex) {
                                    return (
                                        <div className="tags">

                                            <div className='title'>
                                                <h1>Eventos do mês de {val.mes} de {year}</h1>
                                            </div>

                                            <div className='events'>

                                            {val.dias.length > 0 && (
                                                val.dias.map((dia, j) => {
                                                    const eventosDisponiveis = dia.eventos.filter(evento => evento.disponivel !== false);

                                                    return eventosDisponiveis.length > 0 && (
                                                        <div className='card' key={j}>
                                                            <a>Dia {j + 1} de {val.mes} de {year}</a>
                                                            <div className='events'>
                                                                {eventosDisponiveis.map((evento, k) => (
                                                                    <div 
                                                                        id={`evento#${j + 1}#${k + 1}`} 
                                                                        className='event' 
                                                                        style={{ border: `3px solid ${evento.cor}`, '--evento-cor': evento.cor }} 
                                                                        key={k}
                                                                    >
                                                                        <img src={evento.imagem} alt={evento.jogo} />
                                                                        <h1>{evento.fase} - {evento.jogo}</h1>
                                                                        <p>{evento.horario}</p>
                                                                        {evento.times && evento.times.length > 0 && (
                                                                            <h2 className='times'>
                                                                                {evento.times.map((time, l) => (
                                                                                    <React.Fragment key={l}>
                                                                                        <span>{time}</span>
                                                                                        {l + 1 !== evento.times.length && <span>x</span>}
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </h2>
                                                                        )}
                                                                        {evento.resultado && (
                                                                            <h2>{evento.resultado}</h2>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}


                                            </div>
                                        </div>
                                    )
                                }
                            })}

                        </>
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


        {/* Atualizações */}
        {mdPopupAlert && (
            <Popup>
                <div className='alert'>
                    <div className='bar'>
                        <h1>Atualizações importantes do <strong>Interclasse</strong></h1>
                        <IoClose onClick={() => setMdPopupAlert(false)} className='icon' />
                    </div>

                    {/* Jogos */}

                    <h2><strong>Datas</strong></h2>
                    <p>As datas são oficiais. O Interclasse Gamer começará neste mês de outubro, no dia 11 (Sexta-Feira) e os jogos serão divididos por semanas, com partidas acontecendo a cada semana.</p>

                    <h2><strong>Calendário</strong> Adicionado</h2>
                    <p>
                    O Website agora possui o calendário de eventos do interclasse {year}, clique nos três riscos na parte superior do site e depois em 'Calendário' para acessar essa nova feature :)
                    </p>

                    <h2>Jogo Adicionado - <strong>Counter Strike</strong></h2>
                    <p>
                    O motivo da substituição do Roblox pelo Counter Strike é devido à natureza diversificada dos minigames presentes no Roblox, que frequentemente geram divergências entre os participantes. <br/><br/> 
                    Em contrapartida, o Counter Strike é um jogo mais padronizado, o que facilita a organização. Além disso, por ser uma plataforma de jogo para computadores, oferece maior controle e acessibilidade para todos os envolvidos.
                    </p>
                    
                    <h2>Chaveamentos e Grupos</h2>
                    <p>O sorteio das chaves para as quartas de final dos jogos <strong>Free Fire</strong>, <strong>Counter Strike</strong> e <strong>Brawl Stars</strong> será realizado durante o intervalo, permitindo que todos os estudantes possam acompanhar e garantir que o processo seja conduzido de maneira legítima e transparente.</p>

                    <h2>Critérios para <strong>participar</strong></h2>
                    <p>
                    Os critérios para participação são: na semana de início do Interclasse, as partidas ocorrerão toda quinta e sexta-feira. Dentro dessa mesma semana, o competidor não poderá faltar mais de <strong>1 dia</strong>, a menos que apresente um atestado médico ou um motivo plausível.<br/><br/>
                    O foco é que os jogadores, a torcida e a turma se divirtam neste Interclasse e que tudo ocorra bem para que o evento possa acontecer mais vezes e em todos os anos. No entanto, há uma falta significativa de alunos na escola. Como iniciativa do <strong>Grêmio Estudantil</strong>, em parceria com a diretoria, criamos este Interclasse e estabelecemos esses critérios para incentivar a frequência dos alunos. Como recompensa, eles poderão participar dos treinamentos e dos jogos.
                    </p>
                
                
                    <a>Atualizado: Dia 4 de Outubro de 2024</a>
                </div>
            </Popup>
        )}

    </>
  )
}
