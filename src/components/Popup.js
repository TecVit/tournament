import React from 'react';
import './css/Popup.css';

import Logo from '../image/logo.png';
import { FaGlobe } from 'react-icons/fa';

export default function Pupup({ children }) {

  return (
    <main className='container-popup'>
        <section className='content-popup'>
          {children}
        </section>
    </main>
  )
}