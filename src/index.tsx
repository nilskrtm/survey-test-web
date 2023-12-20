import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistedStore, store } from './store/store';
import { GlobalNavigation } from './utils/navigation/GlobalNavigation';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './utils/navigation/ProtectedRoute';
import NoMatchRoute from './utils/navigation/NoMatchRoute';
import Logout from './app/authentication/Logout';
import Login from './app/authentication/Login';
import Dashboard from './app/home/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <BrowserRouter>
        <GlobalNavigation />
        <Routes>
          <Route path="/" element={<NoMatchRoute redirectPath="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectPath="/login">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoMatchRoute redirectPath="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
