import React, { createRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { Survey } from '../../data/types/survey.types';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import SurveyService from '../../data/services/survey.service';
import ContentEditable from '../../components/layout/editable.content/ContentEditable';
import { BarLoader } from 'react-spinners';
import { APIError } from '../../data/types/common.types';

interface SurveyOverviewPathParams extends Record<string, string> {
  surveyId: string;
}

const SurveyOverview: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfrage');

  const navigate = useNavigate();

  const { surveyId } = useParams<SurveyOverviewPathParams>();
  const loader = useLoader();
  const [survey, setSurvey] = useState<Survey>();

  const [updating, setUpdating] = useState(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedSurvey, setUpdatedSurvey] = useState<Survey>({} as Survey);

  const surveyNameRef = createRef<HTMLTextAreaElement>();
  const surveyDescriptionRef = createRef<HTMLTextAreaElement>();

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

  const updateSurveyInternal: (values: Partial<Survey>) => void = (values) => {
    if (!updatedSurvey) return;

    setUpdatedSurvey({
      ...updatedSurvey,
      ...values
    });
  };

  const updateSurvey: (values: Partial<Survey>) => void = (values) => {
    if (!survey) return;

    setUpdating(true);
    setUpdatingValues(Object.keys(values));

    SurveyService.updateSurvey(survey._id, values)
      .then((response) => {
        if (response.success) {
          setSurvey({ ...survey, ...values });
          setUpdatedSurvey({ ...survey, ...values });
        } else {
          setUpdatedSurvey(survey);

          const error = response.error as APIError;

          if (error.hasFieldErrors) {
            // TODO: send Error-Message - error?.errorMessage
          } else {
            // TODO: send Error-Message- ein unbekannter Fehler ist aufgetreten
          }
        }
      })
      .finally(() => {
        setUpdating(false);
        setUpdatingValues([]);
      });
  };

  return (
    <div className="w-full grid grid-cols-1 gap-4 xl:gap-6 p-6">
      <div className="w-full flex flex-col items-start justify-center rounded-lg gap-2 lg:gap-5 bg-white border border-gray-200 p-6">
        <div className="w-full inline-block">
          <ContentEditable
            className={`max-w-full resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none hover:ring-gray-200 hover:ring-1 text-2xl font-semibold whitespace-nowrap truncate overflow-hidden after:px-2 ${
              updating && updatingValues.includes('name') ? '!py-0' : ''
            }`}
            disabled={loader.loading || updating}
            html={updatedSurvey.name || ''}
            onBlur={(event) => {
              updateSurvey({ name: event.target.innerHTML });
            }}
            onChange={(event) => {
              updateSurveyInternal({ name: event.target.value });
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                surveyNameRef.current?.blur();
              }
            }}
            preventLinebreak={true}
            preventPaste={true}
            innerRef={surveyNameRef}
          />
          <BarLoader
            color="rgb(126 34 206)"
            cssOverride={{ width: '100%' }}
            height={1}
            loading={updating && updatingValues.includes('name')}
          />
        </div>
        <div className="w-full inline-block">
          <ContentEditable
            className={`max-w-full resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none hover:ring-gray-200 hover:ring-1 text-base text-gray-800 font-semibold whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
              updating && updatingValues.includes('description') ? '!py-0' : ''
            }`}
            disabled={loader.loading || updating}
            html={updatedSurvey.description || ''}
            onBlur={(event) => {
              updateSurvey({ description: event.target.innerHTML });
            }}
            onChange={(event) => {
              updateSurveyInternal({ description: event.target.value });
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                surveyDescriptionRef.current?.blur();
              }
            }}
            preventLinebreak={true}
            preventPaste={true}
            innerRef={surveyDescriptionRef}
          />
          <BarLoader
            color="rgb(126 34 206)"
            cssOverride={{ width: '100%' }}
            height={1}
            loading={updating && updatingValues.includes('description')}
          />
        </div>
      </div>
    </div>
  );
};

export default SurveyOverview;
