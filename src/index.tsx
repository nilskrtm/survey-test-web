import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './datetimepicker.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistedStore, store } from './store/store';
import GlobalNavigationProvider from './components/navigation/GlobalNavigationProvider';
import LiveUserDataProvider from './components/user/LiveUserDataProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RedirectRoute from './components/navigation/RedirectRoute';
import Logout from './app/authentication/Logout';
import Login from './app/authentication/Login';
import Dashboard from './app/home/Dashboard';
import { protectRoute } from './utils/navigation/navigation.util';
import { layoutRoute } from './utils/layout/layout.util';
import Imprint from './app/legal/Imprint';
import SurveyList from './app/surveys/SurveyList';
import SurveyOverview from './app/surveys/SurveyOverview';
import AnswerPictures from './app/answer.pictures/AnswerPictures';
import Settings from './app/settings/Settings';
import Votings from './app/votings/Votings';
import ToastProvider from './components/layout/toasts/ToastProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const defaultRoute = <RedirectRoute redirectPath="/dashboard" />;
const imprintRoute = <Imprint />;
const loginRoute = <Login />;
const logoutRoute = <Logout />;
const dashboardRoute = layoutRoute(<Dashboard />);
const surveyListRoute = layoutRoute(<SurveyList />);
const surveyOverviewRoute = layoutRoute(<SurveyOverview />);
const votingsRoute = layoutRoute(<Votings />);
const answerPicturesRoute = layoutRoute(<AnswerPictures />);
const settingsRoute = layoutRoute(<Settings />);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <BrowserRouter>
        <GlobalNavigationProvider />
        <LiveUserDataProvider />
        <ToastProvider />

        <Routes>
          <Route path="/" element={defaultRoute} />
          <Route path="/imprint" element={imprintRoute} />
          <Route path="/impressum" element={imprintRoute} />
          <Route path="/login" element={loginRoute} />
          <Route path="/logout" element={logoutRoute} />
          <Route path="/dashboard" element={protectRoute(dashboardRoute, false)} />
          <Route path="/surveys" element={protectRoute(surveyListRoute, false)} />
          <Route path="/surveys/:surveyId" element={protectRoute(surveyOverviewRoute, false)} />
          <Route path="/votings" element={protectRoute(votingsRoute, false)} />
          <Route path="/answer-pictures" element={protectRoute(answerPicturesRoute, false)} />
          <Route path="/settings" element={protectRoute(settingsRoute, false)} />
          <Route path="*" element={defaultRoute} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
