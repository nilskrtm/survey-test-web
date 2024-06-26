import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistedStore, store } from './store/store';
import { Helmet } from 'react-helmet';
import GlobalNavigationProvider from './components/navigation/GlobalNavigationProvider';
import LiveUserDataProvider from './components/users/LiveUserDataProvider';
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
import AnswerPictureList from './app/answer.pictures/AnswerPictureList';
import Settings from './app/settings/Settings';
import Votings from './app/votings/Votings';
import ToastProvider from './components/layout/toasts/ToastProvider';
import PasswordResetRequest from './app/authentication/PasswordResetRequest';
import PasswordReset from './app/authentication/PasswordReset';
import AnswerPictureOverview from './app/answer.pictures/AnswerPictureOverview';
import UserList from './app/users/UserList';
import UserOverview from './app/users/UserOverview';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const defaultRoute = <RedirectRoute redirectPath="/dashboard" />;
const imprintRoute = <Imprint />;
const loginRoute = <Login />;
const passwordResetRequestRoute = <PasswordResetRequest />;
const passwordResetRoute = <PasswordReset />;
const logoutRoute = <Logout />;
const userListRoute = layoutRoute(<UserList />);
const userOverviewRoute = layoutRoute(<UserOverview />);
const dashboardRoute = layoutRoute(<Dashboard />);
const surveyListRoute = layoutRoute(<SurveyList />);
const surveyOverviewRoute = layoutRoute(<SurveyOverview />);
const votingsRoute = layoutRoute(<Votings />);
const answerPictureListRoute = layoutRoute(<AnswerPictureList />);
const answerPictureOverviewRoute = layoutRoute(<AnswerPictureOverview />);
const settingsRoute = layoutRoute(<Settings />);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <BrowserRouter>
        <Helmet>
          <meta
            name="description"
            content={import.meta.env.HTML_DESCRIPTION || 'env.HTML_DESCRIPTION missing'}
          />
          <title>{import.meta.env.HTML_TITLE || 'env.HTML_TITLE missing'}</title>
        </Helmet>

        <GlobalNavigationProvider />
        <LiveUserDataProvider />
        <ToastProvider />

        <Routes>
          <Route path="/" element={defaultRoute} />
          <Route path="/imprint" element={imprintRoute} />
          <Route path="/impressum" element={imprintRoute} />
          <Route path="/login" element={loginRoute} />
          <Route path="/reset-password" element={passwordResetRequestRoute} />
          <Route path="/reset-password/:passwordRequestId" element={passwordResetRoute} />
          <Route path="/logout" element={logoutRoute} />
          <Route path="/users" element={protectRoute(userListRoute, true)} />
          <Route path="/users/:userId" element={protectRoute(userOverviewRoute, true)} />
          <Route path="/dashboard" element={protectRoute(dashboardRoute, false)} />
          <Route path="/surveys" element={protectRoute(surveyListRoute, false)} />
          <Route path="/surveys/:surveyId" element={protectRoute(surveyOverviewRoute, false)} />
          <Route path="/votings" element={protectRoute(votingsRoute, false)} />
          <Route path="/answer-pictures" element={protectRoute(answerPictureListRoute, false)} />
          <Route
            path="/answer-pictures/:answerPictureId"
            element={protectRoute(answerPictureOverviewRoute, false)}
          />
          <Route path="/settings" element={protectRoute(settingsRoute, false)} />
          <Route path="*" element={defaultRoute} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
