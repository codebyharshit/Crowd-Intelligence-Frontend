import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreateForms from './components/pages/CreateForms.tsx';
import Dashboard from './components/pages/Dashboard.tsx';
import Home from './components/pages/Home.tsx';
import AnswerQuestionnaire from './components/pages/AnswerQuestionnaire.tsx';
import Newsfeed from './components/pages/Newsfeed.tsx';
import GamificationProfile from './components/pages/GamificationProfile.tsx';
import AboutPage from './components/pages/AboutPage.tsx';
import { Card, Typography } from 'antd';

const QuestionnaireCard: React.FC = () => {
  return (
    <div className="p-8">
      <Card className="p-4 my-16 lg:w-1/2 sm:w-11/12 m-auto">
        <Typography.Title level={3}>Create a Questionnaire</Typography.Title>
        <CreateForms />
      </Card>
    </div>
  );
};

const AnswerQuestionnaireCard: React.FC = () => {
  return (
    <div className="p-8">
      <Card className="p-4 my-16 lg:w-1/2 sm:w-full m-auto">
        <AnswerQuestionnaire readOnly={false} /> 
      </Card>
    </div>
  );
};

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/create-forms",
        element: <QuestionnaireCard />,
      },
      {
        path: "/my-questionnaires",
        element: <Newsfeed replyMode={false} />,
      },
      {
        path: "/answer-forms",
        element: <Newsfeed replyMode />,
      },
      {
        path: "/answer-forms/:id",
        element:  <AnswerQuestionnaireCard />,
      },
      {
        path: "/dashboard/:id",
        element: <Dashboard />,
      },
      {
        path: "/gamification-profile",
        element: <GamificationProfile />,
      },
      {
        path: "/about-page",
        element: <AboutPage />,
      }
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={browserRouter}/>
  </React.StrictMode>,
);
