import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';
import { Survey } from '../../data/types/survey.types';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader';
import SurveyService from '../../data/services/survey.service';
import ContentEditable from 'react-contenteditable';

interface SurveyOverviewPathParams extends Record<string, string | undefined> {
  surveyId: string;
}

const SurveyOverview: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfrage');

  const navigate = useNavigate();

  const { surveyId } = useParams<SurveyOverviewPathParams>();
  const loader = useLoader();
  const [survey, setSurvey] = useState<Survey>();

  const [updatedSurvey, setUpdatedSurvey] = useState<Survey>({} as Survey);

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  const loadSurvey = () => {
    if (!surveyId) return;

    loader.set(LoadingOption.LOADING);

    SurveyService.getSurvey(surveyId).then((response) => {
      if (response.success) {
        setSurvey(response.data.survey);
        setUpdatedSurvey(response.data.survey);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);

        if (response.error?.status === 404) {
          navigate(-1);
        }
      }
    });
  };

  const updateSurveyInternal: (values: Partial<Survey>) => void = (values: Partial<Survey>) => {
    if (!updatedSurvey) return;

    setUpdatedSurvey({
      ...updatedSurvey,
      ...values
    });
  };

  const updateSurvey: (values: Partial<Survey>) => void = (values: Partial<Survey>) => {
    if (!survey) return;

    SurveyService.updateSurvey(survey._id, values).then((response) => {
      if (response.success) {
        console.log('success');
        setSurvey({ ...survey, ...values });
        setUpdatedSurvey({ ...survey, ...values });
      } else {
        console.log('error');
        setUpdatedSurvey(survey);
      }
    });
  };

  return (
    <div>
      <ContentEditable
        tagName="p"
        html={updatedSurvey.name || ''}
        disabled={loader.loading}
        onChange={(event) => {
          updateSurveyInternal({ name: event.target.value });
        }}
        onBlur={(event) => {
          updateSurvey({ name: event.target.innerHTML });
        }}
      />
    </div>
  );
};

export default SurveyOverview;
