import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Home from './pages/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import store from './store';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </>,
);
