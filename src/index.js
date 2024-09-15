import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import RouterApp from './Router';

import './css/customToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <RouterApp />
  //</React.StrictMode>
);