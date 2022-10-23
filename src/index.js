import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import store from './store';
import AuthContextProvider from './contexts/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <>
        <AuthContextProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </AuthContextProvider>
    </>,
);
