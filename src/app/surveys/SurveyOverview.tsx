import React, { createRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { Survey } from '../../data/types/survey.types';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import SurveyService from '../../data/services/survey.service';
import ContentEditable from '../../components/layout/editable.content/ContentEditable';
import { BarLoader, BounceLoader } from 'react-spinners';
import { APIError } from '../../data/types/common.types';
import useToasts from '../../utils/hooks/use.toasts.hook';
import FinalizeSurveyModal, {
  FinalizeSurveyModalRefAttributes
} from '../../components/surveys/FinalizeSurveyModal';
import moment from 'moment/moment';
import DateTimePicker from '../../components/layout/time/DateTimePicker';
import useGroupClickOutside from '../../utils/hooks/use.group.click.outside.hook';
import { dummySurvey } from '../../utils/surveys/surveys.util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Question } from '../../data/types/question.types';
import QuestionService from '../../data/services/question.service';
import QuestionModal, {
  QuestionModalRefAttributes
} from '../../components/questions/QuestionModal';
import ReorderQuestionsModal, {
  ReorderQuestionsModalRefAttributes
} from '../../components/questions/ReorderQuestionsModal';
import DeleteSurveyModal, {
  DeleteSurveyModalRefAttributes
} from '../../components/surveys/DeleteSurveyModal';
import { hasChanged } from '../../utils/data/update.util';

interface SurveyOverviewPathParams extends Record<string, string> {
  surveyId: string;
}

const SurveyOverview: () => React.JSX.Element = () => {
  const setDashboardTitle = useDashboardTitle('Meine Umfrage');
  const navigate = useNavigate();
  const toaster = useToasts();

  const { surveyId } = useParams<SurveyOverviewPathParams>();
  const loader = useLoader();
  const [survey, setSurvey] = useState<Survey>();

  const questionModalRef = createRef<QuestionModalRefAttributes>();
  const reorderQuestionsModalRef = createRef<ReorderQuestionsModalRefAttributes>();
  const finalizeSurveyModalRef = createRef<FinalizeSurveyModalRefAttributes>();
  const deleteSurveyModalRef = createRef<DeleteSurveyModalRefAttributes>();

  const [updating, setUpdating] = useState(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedSurvey, setUpdatedSurvey] = useState<Survey>(dummySurvey());

  const surveyNameRef = createRef<HTMLSpanElement>();
  const surveyDescriptionRef = createRef<HTMLSpanElement>();
  const surveyGreetingRef = createRef<HTMLSpanElement>();
  const surveyStartDateRef = createRef<HTMLSpanElement>();
  const surveyEndDateRef = createRef<HTMLSpanElement>();
  const surveyStartDatePickerRef = createRef<HTMLDivElement>();
  const surveyEndDatePickerRef = createRef<HTMLDivElement>();

  const [editingSurveyDate, setEditingSurveyDate] = useState<'startDate' | 'endDate'>();

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
    if (
      !survey ||
      (!survey.draft &&
        !Object.keys(values).includes('archived') &&
        Object.keys(values).length == 1) ||
      !hasChanged(survey, values)
    )
      return;

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
            const errorMessages: string[] = [];

            for (const key of Object.keys(error.fieldErrors)) {
              errorMessages.push(error.fieldErrors[key]);
            }

            toaster.sendToast('error', errorMessages);
          } else {
            toaster.sendToast(
              'error',
              error.errorMessage ||
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

  const openQuestion: (question: Question) => void = (question) => {
    if (!survey) return;

    questionModalRef.current?.open(question);
  };

  const removeQuestion: (question: Question) => void = (question) => {
    if (!survey || !survey.draft) return;

    setUpdating(true);
    setUpdatingValues(['questions', 'removeQuestion', 'question:' + question._id]);

    QuestionService.removeQuestion(survey._id, question._id).then((response) => {
      if (response.success) {
        QuestionService.getQuestions(survey._id)
          .then((questionsResponse) => {
            if (questionsResponse.success) {
              const newQuestions = questionsResponse.data.questions;

              setSurvey({ ...survey, questions: newQuestions });
              setUpdatedSurvey({ ...survey, questions: newQuestions });
            } else {
              setUpdatedSurvey(survey);

              toaster.sendToast(
                'error',
                'Ein unbekannter Fehler ist beim Löschen der Frage aufgetreten.'
              );
            }
          })
          .finally(() => {
            setUpdating(false);
            setUpdatingValues([]);
          });
      } else {
        setUpdatedSurvey(survey);

        toaster.sendToast(
          'error',
          'Ein unbekannter Fehler ist beim Löschen der Frage aufgetreten.'
        );

        setUpdating(false);
        setUpdatingValues([]);
      }
    });
  };

  const createQuestion: () => void = () => {
    if (!survey || !survey.draft) return;

    setUpdating(true);
    setUpdatingValues(['questions', 'createQuestion']);

    QuestionService.createQuestion(survey._id).then((response) => {
      if (response.success) {
        const questionId = response.data.id;

        QuestionService.getQuestion(survey._id, questionId)
          .then((questionResponse) => {
            if (questionResponse.success) {
              const question = questionResponse.data.question;
              const oldQuestions = [...survey.questions];

              oldQuestions.push(question);

              setSurvey({ ...survey, questions: oldQuestions });
              setUpdatedSurvey({ ...survey, questions: oldQuestions });
            } else {
              setUpdatedSurvey(survey);

              toaster.sendToast(
                'error',
                'Ein unbekannter Fehler ist beim Hinzufügen einer Frage aufgetreten.'
              );
            }
          })
          .finally(() => {
            setUpdating(false);
            setUpdatingValues([]);
          });
      } else {
        setUpdatedSurvey(survey);

        toaster.sendToast(
          'error',
          'Ein unbekannter Fehler ist beim Hinzufügen einer Frage aufgetreten.'
        );

        setUpdating(false);
        setUpdatingValues([]);
      }
    });
  };

  const reorderQuestions: () => void = () => {
    if (!survey || !survey.draft) return;

    if (reorderQuestionsModalRef.current) {
      reorderQuestionsModalRef.current.open(survey.questions);
    }
  };

  const finalizeSurvey: () => void = () => {
    if (!survey || !survey.draft) return;

    if (finalizeSurveyModalRef.current) {
      setUpdating(true);
      setUpdatingValues(['draft']);

      finalizeSurveyModalRef.current.open();
    }
  };

  const finalizedSurvey: (success: boolean, finalizedSurvey?: Survey) => void = (
    success,
    finalizedSurvey
  ) => {
    if (success && finalizedSurvey) {
      setSurvey(finalizedSurvey);
      setUpdatedSurvey(finalizedSurvey);

      toaster.sendToast('success', 'Die Umfrage wurde erfolgreich finalisiert.');
    } else {
      setUpdatedSurvey(survey as Survey);
    }

    setUpdating(false);
    setUpdatingValues([]);
  };

  const deleteSurvey: () => void = () => {
    if (!survey) return;

    if (deleteSurveyModalRef.current) {
      deleteSurveyModalRef.current.open();
    }
  };

  const surveyActive: () => boolean = () => {
    if (!survey || survey?.draft) return false;

    const currentDate = new Date();
    const startDate = new Date(survey.startDate);
    const endDate = new Date(survey.endDate);

    return (
      startDate.getTime() <= currentDate.getTime() && currentDate.getTime() < endDate.getTime()
    );
  };

  useGroupClickOutside(
    [surveyStartDateRef, surveyEndDateRef, surveyStartDatePickerRef, surveyEndDatePickerRef],
    () => {
      if (editingSurveyDate !== undefined) {
        setEditingSurveyDate(undefined);
        updateSurvey({ startDate: updatedSurvey.startDate, endDate: updatedSurvey.endDate });
      }
    }
  );

  if (loader.loading || loader.error) {
    if (loader.loading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
          <BounceLoader color="rgb(126 34 206)" size={70} />
          <p className="text-medium font-medium text-gray-700">Laden der Umfrage</p>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
          <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
          <p className="text-medium font-medium text-gray-700">Laden der Umfrage fehlgeschlagen</p>
        </div>
      );
    }
  }

  return (
    <>
      <div className="w-full h-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-auto">
        <div className="w-full flex flex-col items-start justify-center rounded-lg gap-2 bg-white border border-gray-200 p-6">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-[calc(100%-56px)]">
              <div className="w-full inline-block">
                <ContentEditable
                  className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-2xl font-semibold whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
                    !loader.loading && updatedSurvey.draft && !updating
                      ? 'hover:ring-gray-200 hover:ring-1'
                      : ''
                  } ${updating && updatingValues.includes('name') ? '!py-0' : ''}`}
                  disabled={loader.loading || !updatedSurvey.draft || updating}
                  html={updatedSurvey.name}
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
                  maxLength={50}
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
                  className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-base text-gray-600 font-semibold whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
                    !loader.loading && updatedSurvey.draft && !updating
                      ? 'hover:ring-gray-200 hover:ring-1'
                      : ''
                  } ${updating && updatingValues.includes('description') ? '!py-0' : ''}`}
                  disabled={loader.loading || !updatedSurvey.draft || updating}
                  html={updatedSurvey.description}
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
                  maxLength={150}
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
            <div className="h-full w-20 flex flex-col items-center justify-start gap-1 pl-2">
              {survey?.draft && (
                <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-purple-800">
                  <span className="text-xs text-white font-semibold no-select">Entwurf</span>
                </div>
              )}
              {!survey?.draft && !surveyActive() && (
                <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-green-400">
                  <span className="text-xs text-white font-semibold no-select">Bereit</span>
                </div>
              )}
              {!survey?.draft && surveyActive() && (
                <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-green-400">
                  <span className="text-xs text-white font-semibold no-select">Aktiv</span>
                </div>
              )}
              {survey?.archived && (
                <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-orange-400">
                  <span className="text-xs text-white font-semibold no-select">Archiv</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Zeitraum</span>
          <div className="w-full flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 flex flex-row items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Start:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (!loader.loading && updatedSurvey.draft && !updating) {
                      if (editingSurveyDate !== 'startDate') {
                        setEditingSurveyDate('startDate');
                      }
                    }
                  }}
                  ref={surveyStartDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingSurveyDate === 'startDate' ? '!ring-2 !ring-black' : ''
                  } ${
                    !loader.loading && updatedSurvey.draft && !updating
                      ? 'hover:ring-gray-200 hover:ring-1'
                      : ''
                  } ${
                    updatedSurvey.draft &&
                    new Date(updatedSurvey.startDate).getTime() + 60000 < new Date().getTime()
                      ? 'TODO'
                      : ''
                  }`}>
                  {moment(updatedSurvey.startDate).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr'}
                </span>
                {editingSurveyDate === 'startDate' && (
                  <DateTimePicker
                    className="absolute z-10 top-8"
                    ref={surveyStartDatePickerRef}
                    value={new Date(updatedSurvey.startDate)}
                    maxDate={new Date(updatedSurvey.endDate)}
                    onChange={(date) => updateSurveyInternal({ startDate: date.toISOString() })}
                  />
                )}
                <BarLoader
                  color="rgb(126 34 206)"
                  cssOverride={{ width: '100%' }}
                  height={1}
                  loading={updating && updatingValues.includes('startDate')}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-crow items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Ende:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (!loader.loading && updatedSurvey.draft && !updating) {
                      if (editingSurveyDate !== 'endDate') {
                        setEditingSurveyDate('endDate');
                      }
                    }
                  }}
                  ref={surveyEndDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingSurveyDate === 'endDate' ? '!ring-2 !ring-black' : ''
                  } ${
                    !loader.loading && updatedSurvey.draft && !updating
                      ? 'hover:ring-gray-200 hover:ring-1'
                      : ''
                  } ${
                    updatedSurvey.draft &&
                    new Date(updatedSurvey.endDate).getTime() < new Date().getTime()
                      ? '!text-red-500'
                      : ''
                  }`}>
                  {moment(updatedSurvey.endDate).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr'}
                </span>
                {editingSurveyDate === 'endDate' && (
                  <DateTimePicker
                    className="absolute z-10 top-8"
                    ref={surveyEndDatePickerRef}
                    value={new Date(updatedSurvey.endDate)}
                    minDate={new Date(updatedSurvey.startDate)}
                    onChange={(date) => updateSurveyInternal({ endDate: date.toISOString() })}
                  />
                )}
                <BarLoader
                  color="rgb(126 34 206)"
                  cssOverride={{ width: '100%' }}
                  height={1}
                  loading={updating && updatingValues.includes('endDate')}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Begrüßung</span>
          <div className="w-full inline-block">
            <ContentEditable
              className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-lg text-black font-normal whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
                !loader.loading && updatedSurvey.draft && !updating
                  ? 'hover:ring-gray-200 hover:ring-1'
                  : ''
              } ${updating && updatingValues.includes('greeting') ? '!py-0' : ''}`}
              disabled={loader.loading || !updatedSurvey.draft || updating}
              html={updatedSurvey.greeting}
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
              maxLength={300}
              preventLinebreak={true}
              preventPaste={true}
              innerRef={surveyGreetingRef}
              tagName="span"
            />
            <BarLoader
              color="rgb(126 34 206)"
              cssOverride={{ width: '100%' }}
              height={1}
              loading={updating && updatingValues.includes('greeting')}
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Fragen</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            {updatedSurvey.draft
              ? 'Doppelklick auf eine Frage um diese zu Bearbeiten.'
              : 'Doppelklick auf eine Frage um Details zu sehen.'}
          </span>
          {survey?.questions.length === 0 && (
            <span className="text-base font-normal text-red-500">Noch keine Fragen</span>
          )}
          <div className="w-full flex flex-col items-center justify-center gap-2 overflow-y-hidden">
            {updatedSurvey.questions
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((question, index) => {
                return (
                  <div
                    key={'question_' + index}
                    className={`w-full flex flex-row items-center justify-between rounded-lg border border-gray-200 py-2 ${
                      updating &&
                      updatingValues.includes('removeQuestion') &&
                      updatingValues.includes('question:' + question._id)
                        ? 'opacity-50'
                        : ''
                    }`}
                    title={updatedSurvey.draft ? 'Doppelklick zum Bearbeiten' : undefined}
                    onClick={(event) => {
                      if (!loader.loading && !updating && event.detail === 2) {
                        openQuestion(question);
                      }
                    }}>
                    <div className="h-12 w-16 flex items-center justify-center p-4 select-none">
                      <span className="text-3xl font-medium text-purple-700">{question.order}</span>
                    </div>
                    <div className="flex-grow flex flex-col items-start justify-center gap-2">
                      <span className="text-lg font-medium">{question.question}</span>
                      <span className="text-base">
                        {question.answerOptions.length} Antwortmöglichkeit
                        {question.answerOptions.length !== 1 ? 'en' : ''}
                      </span>
                    </div>
                    {survey?.draft && (
                      <div className="h-12 w-16 flex items-center justify-center">
                        <button
                          className="flex items-center justify-center rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 p-2 disabled:cursor-not-allowed"
                          disabled={loader.loading || updating || !survey.draft}
                          title="Frage löschen"
                          onClick={() => {
                            removeQuestion(question);
                          }}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="1x"
                            className="text-xl text-red-500"
                            fixedWidth
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {survey?.draft && (
            <div className="w-full flex flex-row items-center justify-start gap-2">
              <button
                onClick={createQuestion}
                className={`px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
                  updating && updatingValues.includes('createQuestion') ? 'loading-button' : ''
                }`}
                disabled={loader.loading || updating || !survey?.draft}
                title={
                  survey?.draft
                    ? 'eine neue Frage erstellen'
                    : 'es kann keine Frage mehr zu der Umfrage hinzugefügt werden'
                }>
                Frage hinzufügen
              </button>
              <button
                onClick={reorderQuestions}
                className="px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
                disabled={
                  loader.loading || updating || !survey?.draft || survey.questions.length === 0
                }
                title={
                  survey?.draft
                    ? 'Reihenfolge der Fragen ändern'
                    : 'Die Reihenfolge der Fragen kann nicht mehr geändert werden'
                }>
                Reihenfolge ändern
              </button>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Finalisierung</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            Nach dem Finalisieren der Umfrage können an dieser keine Änderungen mehr vorgenommen
            werden.
          </span>
          {!updatedSurvey.draft ? (
            <span className="text-base text-red-500 font-medium">
              Die Umfrage ist bereits finalisiert.
            </span>
          ) : (
            <button
              onClick={finalizeSurvey}
              className="px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
              disabled={loader.loading || updating}
              title={
                survey?.draft ? 'Finalisieren der Umfrage' : 'die Umfrage ist bereits finalisiert'
              }>
              Finalisieren
            </button>
          )}
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Archivieren</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            {survey?.archived
              ? 'Die Umfrage ist bereits archiviert.'
              : 'Die Umfrage als archiviert markieren.'}
          </span>
          <button
            onClick={() => {
              updateSurvey({ archived: !survey?.archived });
            }}
            className={`px-3 py-[8px] rounded-md bg-orange-400 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed
              ${updating && updatingValues.includes('archived') ? 'loading-button' : ''}`}
            disabled={loader.loading || updating}
            title={survey?.archived ? 'Umfrage aus dem Archiv entfernen' : 'Umfrage archivieren'}>
            {survey?.archived ? 'Aus Archiv entfernen' : 'Archivieren'}
          </button>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Löschen</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            Mit dem Löschen der Umfrage werden alle Daten zu dieser, inklusive aller bereits
            gespeicherten Abstimmungen gelöscht. Dieser Vorgang kann nicht rückgängig gemacht
            werden.
          </span>
          <button
            onClick={deleteSurvey}
            className="px-3 py-[8px] rounded-md bg-red-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed"
            disabled={loader.loading || updating}
            title="Löschen der Umfrage">
            Löschen
          </button>
        </div>
      </div>

      {/* question modal */}
      {survey && (
        <QuestionModal
          ref={questionModalRef}
          survey={survey}
          onUpdateQuestion={(question) => {
            const tempSurvey: Survey = Object.assign({}, survey);
            const questionIndex = tempSurvey.questions.findIndex((q) => q.order === question.order);

            tempSurvey.questions[questionIndex] = question;

            setSurvey(tempSurvey);
            setUpdatedSurvey(tempSurvey);
          }}
          onUpdateAnswerOptions={(question, answerOptions) => {
            const tempSurvey: Survey = Object.assign({}, survey);
            const questionIndex = tempSurvey.questions.findIndex((q) => q.order === question.order);

            tempSurvey.questions[questionIndex].answerOptions = answerOptions;

            setSurvey(tempSurvey);
            setUpdatedSurvey(tempSurvey);
          }}
        />
      )}

      {/* reorder questions modal */}
      {survey && (
        <ReorderQuestionsModal
          survey={survey}
          ref={reorderQuestionsModalRef}
          onUpdateQuestionsOrder={(questions) => {
            setSurvey({ ...survey, questions: questions });
            setUpdatedSurvey({ ...survey, questions: questions });
          }}
        />
      )}

      {/* finalize survey modal */}
      {survey && (
        <FinalizeSurveyModal
          survey={survey}
          ref={finalizeSurveyModalRef}
          onFinalized={finalizedSurvey}
        />
      )}

      {/* delete survey modal */}
      {survey && <DeleteSurveyModal survey={survey} ref={deleteSurveyModalRef} />}
    </>
  );
};

export default SurveyOverview;
