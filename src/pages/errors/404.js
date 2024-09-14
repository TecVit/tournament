import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/404.css';

export default function Error404({ painel }) {

    useEffect(() => {
        document.title = 'Error 404';
    }, []);

    const navigate = useNavigate();

    return (
    <main className={`container-error404 ${painel && 'error-painel'}`}>
        <section className='content-error404'>
            <div className='center'>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <p>O recurso solicitado não foi encontrado neste servidor!</p>
            </div>
        </section>
    </main>
    )
}