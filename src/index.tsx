import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistedStore, store } from './store/store';
import { GlobalNavigation } from './utils/navigation/GlobalNavigation';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RedirectRoute from './utils/navigation/RedirectRoute';
import Logout from './app/authentication/Logout';
import Login from './app/authentication/Login';
import Dashboard from './app/home/Dashboard';
import { protectRoute } from './utils/navigation/navigation.util';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <BrowserRouter>
        <GlobalNavigation />
        <Routes>
          <Route path="/" element={<RedirectRoute redirectPath="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={protectRoute(<Dashboard />, '/login', false)} />
          <Route path="*" element={<RedirectRoute redirectPath="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
