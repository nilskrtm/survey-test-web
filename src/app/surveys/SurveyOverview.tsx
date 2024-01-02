import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';
import { Survey } from '../../data/types/survey.types';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader';
import SurveyService from '../../data/services/survey.service';

interface SurveyOverviewPathParams extends Record<string, string | undefined> {
  surveyId: string;
}

const SurveyOverview: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfrage');

  const { surveyId } = useParams<SurveyOverviewPathParams>();
  const loader = useLoader();
  const [survey, setSurvey] = useState<Survey>();

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  const loadSurvey = () => {
    if (!surveyId) return;

    loader.set(LoadingOption.LOADING);

    SurveyService.getSurvey(surveyId).then((response) => {
      if (response.success) {
        setSurvey(response.data.survey);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  return <div>{JSON.stringify(survey)}</div>;
};

export default SurveyOverview;
