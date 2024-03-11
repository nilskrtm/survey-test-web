import React, { createRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { Survey } from '../../data/types/survey.types';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import SurveyService from '../../data/services/survey.service';
import ContentEditable from '../../components/layout/editable.content/ContentEditable';
import { BarLoader } from 'react-spinners';
import { APIError } from '../../data/types/common.types';
import useToasts from '../../utils/hooks/use.toasts.hook';
import FinalizeSurveyModal, {
  FinalizeSurveyModalRefAttributes
} from '../../components/surveys/FinalizeSurveyModal';

interface SurveyOverviewPathParams extends Record<string, string> {
  surveyId: string;
}

const SurveyOverview: () => React.JSX.Element = () => {
  const setDashboardTitle = useDashboardTitle('Meine Umfrage');
  const navigate = useNavigate();

  const { surveyId } = useParams<SurveyOverviewPathParams>();
  const loader = useLoader();
  const [survey, setSurvey] = useState<Survey>();

  const finalizeSurveyModalRef = createRef<FinalizeSurveyModalRefAttributes>();

  const [updating, setUpdating] = useState(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedSurvey, setUpdatedSurvey] = useState<Survey>({} as Survey);

  const surveyNameRef = createRef<HTMLSpanElement>();
  const surveyDescriptionRef = createRef<HTMLSpanElement>();
  const surveyGreetingRef = createRef<HTMLSpanElement>();

  const toaster = useToasts();

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  useEffect(() => {
    if (survey?.name) {
      setDashboardTitle('Meine Umfrage: ' + survey.name);
    } else {
      setDashboardTitle('Meine Umfrage');
    }
  }, [survey]);

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
            toaster.sendToast('error', error.errorMessage);
          } else {
            toaster.sendToast(
              'error',
              'Ein unbekannter Fehler ist beim Bearbeiten der Umfrage aufgetreten.'
            );
          }
        }
      })
      .finally(() => {
        setUpdating(false);
        setUpdatingValues([]);
      });
  };

  const finalizeSurvey: () => void = () => {
    if (!survey || !survey.draft) return;

    if (finalizeSurveyModalRef.current) {
      setUpdating(true);
      setUpdatingValues(['draft']);

      finalizeSurveyModalRef.current.open();
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4 xl:gap-6 p-6">
        <div className="w-full flex flex-col items-start justify-center rounded-lg gap-2 bg-white border border-gray-200 p-6">
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
              onClick={() => {
                if (surveyNameRef.current != document.activeElement) {
                  surveyNameRef.current?.focus();
                }
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
              tagName="span"
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
              onClick={() => {
                if (surveyDescriptionRef.current != document.activeElement) {
                  surveyDescriptionRef.current?.focus();
                }
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
              tagName="span"
            />
            <BarLoader
              color="rgb(126 34 206)"
              cssOverride={{ width: '100%' }}
              height={1}
              loading={updating && updatingValues.includes('description')}
            />
          </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row rounded-lg bg-white border border-gray-200 p-6">
          <div className="w-full lg:w-1/2 flex flex-row items-center justify-start gap-2">
            <span className="text-lg font-semibold whitespace-nowrap truncate">Start am</span>
          </div>
          <div className="w-full lg:w-1/2 flex flex-crow items-center justify-start gap-2">
            <span className="text-lg font-semibold whitespace-nowrap truncate">Ende am</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-lg font-semibold whitespace-nowrap truncate">Begrüßung</span>
          <ContentEditable
            className={`max-w-full resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none hover:ring-gray-200 hover:ring-1 text-base text-black font-semibold whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
              updating && updatingValues.includes('greeting') ? '!py-0' : ''
            }`}
            disabled={loader.loading || updating}
            html={updatedSurvey.greeting || ''}
            onBlur={(event) => {
              updateSurvey({ greeting: event.target.innerHTML });
            }}
            onChange={(event) => {
              updateSurveyInternal({ greeting: event.target.value });
            }}
            onClick={() => {
              if (surveyGreetingRef.current != document.activeElement) {
                surveyGreetingRef.current?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                surveyGreetingRef.current?.blur();
              }
            }}
            preventLinebreak={true}
            preventPaste={true}
            innerRef={surveyGreetingRef}
            tagName="span"
          />
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-lg font-semibold whitespace-nowrap truncate">Fragen</span>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-lg font-semibold whitespace-nowrap truncate">Finalisierung</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            Nach dem Finalisieren der Umfrage können an dieser keine Änderungen mehr vorgenommen
            werden.
          </span>
          {!survey?.draft ? (
            <span className="text-base text-red-500 font-medium">
              Die Umfrage ist bereits finalisiert.
            </span>
          ) : (
            <button
              onClick={finalizeSurvey}
              className="px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
              disabled={loader.loading || updating}>
              Finalisieren
            </button>
          )}
        </div>
      </div>

      {/* finalize survey modal */}
      {survey && (
        <FinalizeSurveyModal
          survey={survey}
          ref={finalizeSurveyModalRef}
          onFinalized={(success, finalizedSurvey) => {
            if (success && finalizedSurvey) {
              setSurvey(finalizedSurvey);
              setUpdatedSurvey(finalizedSurvey);
            } else {
              setUpdatedSurvey(survey);
            }

            setUpdating(false);
            setUpdatingValues([]);
          }}
        />
      )}
    </>
  );
};

export default SurveyOverview;
