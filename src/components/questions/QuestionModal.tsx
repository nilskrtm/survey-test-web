import React, {
  createRef,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from '../layout/modal/Modal';
import { Question } from '../../data/types/question.types';
import { Survey } from '../../data/types/survey.types';
import ContentEditable from '../layout/editable.content/ContentEditable';
import { APIError } from '../../data/types/common.types';
import { dummyQuestion } from '../../utils/surveys/surveys.util';
import useToasts from '../../utils/hooks/use.toasts.hook';
import QuestionService from '../../data/services/question.service';
import { BarLoader } from 'react-spinners';
import { AnswerPictureUrls } from '../../data/types/answer.picture.types';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPalette, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AnswerOption } from '../../data/types/answer.option.types';
import AnswerOptionsService from '../../data/services/answer.options.service';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import ReorderAnswerOptionsModal, {
  ReorderAnswerOptionsModalRefAttributes
} from '../answer.options/ReorderAnswerOptionsModal';
import { hasChanged } from '../../utils/data/update.util';
import AnswerOptionColorModal, {
  AnswerOptionColorModalRefAttributes
} from '../answer.options/AnswerOptionColorModal';
import AnswerOptionPictureModal, {
  AnswerOptionPictureModalRefAttributes
} from '../answer.options/AnswerOptionPictureModal';

type QuestionModalProps = {
  survey: Survey;
  onUpdateQuestion: (question: Question) => void;
  onUpdateAnswerOptions: (question: Question, answerOptions: AnswerOption[]) => void;
};

export type QuestionModalRefAttributes = {
  open: (question: Question) => void;
};

const QuestionModal: ForwardRefRenderFunction<QuestionModalRefAttributes, QuestionModalProps> = (
  props,
  ref
) => {
  const toaster = useToasts();
  const answerPictureUrlsLoader = useLoader();

  const [visible, setVisible] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question>(dummyQuestion());
  const [updatedQuestion, setUpdatedQuestion] = useState<Question>(dummyQuestion());
  const [answerPictureUrls, setAnswerPictureUrls] = useState<AnswerPictureUrls>({});

  const [updating, setUpdating] = useState<boolean>(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);

  const reorderAnswerOptionsModalRef = createRef<ReorderAnswerOptionsModalRefAttributes>();
  const reorderAnswerOptionsModalContainerRef = createRef<HTMLDivElement>();
  const changeAnswerOptionPictureModalRef = createRef<AnswerOptionPictureModalRefAttributes>();
  const changeAnswerOptionPictureModalContainerRef = createRef<HTMLDivElement>();
  const changeAnswerOptionColorModalRef = createRef<AnswerOptionColorModalRefAttributes>();
  const changeAnswerOptionColorModalContainerRef = createRef<HTMLDivElement>();

  const questionQuestionRef = createRef<HTMLSpanElement>();
  const questionTimeoutRef = createRef<HTMLSpanElement>();

  useImperativeHandle<QuestionModalRefAttributes, QuestionModalRefAttributes>(
    ref,
    () => ({
      open: (question) => {
        if (!visible) {
          answerPictureUrlsLoader.set(LoadingOption.RESET);
          setQuestion(question);
          setUpdatedQuestion(question);
          setAnswerPictureUrls({});
          setUpdating(false);
          setUpdatingValues([]);
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    answerPictureUrlsLoader.set(LoadingOption.LOADING);

    const answerPictureFileNames: Array<string> = [];

    question.answerOptions.forEach((answerOption) => {
      if (answerOption.picture && answerOption.picture.fileName) {
        if (!answerPictureFileNames.includes(answerOption.picture.fileName)) {
          answerPictureFileNames.push(answerOption.picture.fileName);
        }
      }
    });

    AnswerPictureService.getAnswerPictureUrls(answerPictureFileNames).then((response) => {
      if (response.success) {
        answerPictureUrlsLoader.set(LoadingOption.RESET);

        setAnswerPictureUrls((oldAnswerPictureUrls) =>
          Object.assign(Object.assign({}, oldAnswerPictureUrls), response.data.urls)
        );
      } else {
        answerPictureUrlsLoader.set(LoadingOption.ERROR);
      }
    });
  }, [question.answerOptions]);

  const onClose = () => {
    if (visible && !updating) {
      answerPictureUrlsLoader.set(LoadingOption.RESET);
      setVisible(false);
      setUpdating(false);
      setUpdatingValues([]);
      setQuestion(dummyQuestion());
      setUpdatedQuestion(dummyQuestion());
      setAnswerPictureUrls({});
    }
  };

  const updateQuestionInternal: (
    values: Partial<Pick<Question, 'question' | 'timeout'>>
  ) => void = (values) => {
    setUpdatedQuestion({ ...updatedQuestion, ...values });
  };

  const updateQuestion: (values: Partial<Pick<Question, 'question' | 'timeout'>>) => void = (
    values
  ) => {
    if (!hasChanged(question, values)) return;

    setUpdating(true);
    setUpdatingValues(Object.keys(values));

    QuestionService.updateQuestion(props.survey._id, question._id, values)
      .then((response) => {
        if (response.success) {
          props.onUpdateQuestion({ ...question, ...values });
          setUpdatedQuestion({ ...question, ...values });
        } else {
          setUpdatedQuestion(question);

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
              'Ein unbekannter Fehler ist beim Bearbeiten der Frage aufgetreten.'
            );
          }
        }
      })
      .finally(() => {
        setUpdating(false);
        setUpdatingValues([]);
      });
  };

  const changeAnswerOptionPicture: (answerOption: AnswerOption) => void = (answerOption) => {
    if (!props.survey || !props.survey.draft) return;

    if (changeAnswerOptionPictureModalRef.current) {
      changeAnswerOptionPictureModalRef.current.open(answerOption);
    }
  };

  const changeAnswerOptionColor: (answerOption: AnswerOption) => void = (answerOption) => {
    if (!props.survey || !props.survey.draft) return;

    if (changeAnswerOptionColorModalRef.current) {
      changeAnswerOptionColorModalRef.current.open(answerOption);
    }
  };

  const removeAnswerOption: (answerOption: AnswerOption) => void = (answerOption) => {
    if (!props.survey || !props.survey.draft) return;

    setUpdating(true);
    setUpdatingValues(['answerOptions', 'removeAnswerOption', 'answerOption:' + answerOption._id]);

    AnswerOptionsService.removeAnswerOption(props.survey._id, question._id, answerOption._id).then(
      (response) => {
        if (response.success) {
          AnswerOptionsService.getAnswerOptions(props.survey._id, question._id)
            .then((answerOptionsResponse) => {
              if (answerOptionsResponse.success) {
                const newAnswerOptions = answerOptionsResponse.data.answerOptions;

                setQuestion({ ...question, answerOptions: newAnswerOptions });
                setUpdatedQuestion({ ...question, answerOptions: newAnswerOptions });
                props.onUpdateAnswerOptions(question, newAnswerOptions);
              } else {
                setUpdatedQuestion(question);

                toaster.sendToast(
                  'error',
                  'Ein unbekannter Fehler ist beim Löschen der Antwortmöglichkeit aufgetreten.'
                );
              }
            })
            .finally(() => {
              setUpdating(false);
              setUpdatingValues([]);
            });
        } else {
          setUpdatedQuestion(question);

          toaster.sendToast(
            'error',
            'Ein unbekannter Fehler ist beim Löschen der Antwortmöglichkeit aufgetreten.'
          );

          setUpdating(false);
          setUpdatingValues([]);
        }
      }
    );
  };

  const createAnswerOption: () => void = () => {
    if (!props.survey || !props.survey.draft) return;

    setUpdating(true);
    setUpdatingValues(['answerOptions', 'createAnswerOption']);

    AnswerOptionsService.createAnswerOption(props.survey._id, question._id).then((response) => {
      if (response.success) {
        const answerOptionId = response.data.id;

        AnswerOptionsService.getAnswerOption(props.survey._id, question._id, answerOptionId)
          .then((answerOptionResponse) => {
            if (answerOptionResponse.success) {
              const answerOption = answerOptionResponse.data.answerOption;
              const oldAnswerOptions = [...question.answerOptions];

              oldAnswerOptions.push(answerOption);

              setQuestion({ ...question, answerOptions: oldAnswerOptions });
              setUpdatedQuestion({ ...question, answerOptions: oldAnswerOptions });
              props.onUpdateAnswerOptions(question, oldAnswerOptions);
            } else {
              setUpdatedQuestion(question);

              toaster.sendToast(
                'error',
                'Ein unbekannter Fehler ist beim Hinzufügen einer Antwortmöglichkeit aufgetreten.'
              );
            }
          })
          .finally(() => {
            setUpdating(false);
            setUpdatingValues([]);
          });
      } else {
        setUpdatedQuestion(question);

        toaster.sendToast(
          'error',
          'Ein unbekannter Fehler ist beim Hinzufügen einer Antwortmöglichkeit aufgetreten.'
        );

        setUpdating(false);
        setUpdatingValues([]);
      }
    });
  };

  const reorderAnswerOptions: () => void = () => {
    if (!props.survey || !props.survey.draft) return;

    if (reorderAnswerOptionsModalRef.current) {
      reorderAnswerOptionsModalRef.current.open(question.answerOptions);
    }
  };

  return (
    <>
      <Modal
        className="w-full"
        childModals={[
          reorderAnswerOptionsModalContainerRef,
          changeAnswerOptionPictureModalContainerRef,
          changeAnswerOptionColorModalContainerRef
        ]}
        closeable={!updating}
        onRequestClose={onClose}
        title={'Frage ' + question?.order}
        visible={visible}>
        <div className="w-full flex flex-col items-start justify-center">
          <span className="py-2 text-lg font-medium">Frage</span>
          <ContentEditable
            className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-lg text-black font-normal whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
              props.survey.draft && !updating ? 'hover:ring-gray-200 hover:ring-1' : ''
            } ${updating && updatingValues.includes('question') ? '!py-0' : ''}`}
            disabled={!props.survey.draft || updating}
            html={updatedQuestion.question}
            onBlur={(event) => {
              updateQuestion({ question: event.target.innerHTML });
            }}
            onChange={(event) => {
              updateQuestionInternal({ question: event.target.value });
            }}
            onClick={() => {
              if (questionQuestionRef.current != document.activeElement) {
                questionQuestionRef.current?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                questionQuestionRef.current?.blur();
              }
            }}
            maxLength={300}
            preventLinebreak={true}
            preventPaste={true}
            innerRef={questionQuestionRef}
            tagName="span"
          />
          <BarLoader
            color="rgb(126 34 206)"
            cssOverride={{ width: '100%' }}
            height={1}
            loading={updating && updatingValues.includes('question')}
          />
          <span className="py-2 text-lg font-medium">Timeout (in Sekunden)</span>
          <ContentEditable
            className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-lg text-black font-normal whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
              props.survey.draft && !updating ? 'hover:ring-gray-200 hover:ring-1' : ''
            } ${updating && updatingValues.includes('timeout') ? '!py-0' : ''}`}
            disabled={!props.survey.draft || updating}
            html={updatedQuestion.timeout.toString()}
            onBlur={(event) => {
              updateQuestion({ timeout: parseInt(event.target.innerHTML || '0') });
            }}
            onChange={(event) => {
              updateQuestionInternal({ timeout: parseInt(event.target.value || '0') });
            }}
            onClick={() => {
              if (questionTimeoutRef.current != document.activeElement) {
                questionTimeoutRef.current?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                questionTimeoutRef.current?.blur();
              }
            }}
            preventLinebreak={true}
            preventPaste={true}
            innerRef={questionTimeoutRef}
            tagName="span"
          />
          <BarLoader
            color="rgb(126 34 206)"
            cssOverride={{ width: '100%' }}
            height={1}
            loading={updating && updatingValues.includes('timeout')}
          />
          <span className="py-2 text-lg font-medium">Antwortmöglichkeiten</span>
          {question.answerOptions.length === 0 && (
            <span className="text-base font-normal text-red-500">
              Noch keine Antwortmöglichkeiten
            </span>
          )}
          <div className="w-full max-h-72 flex flex-col justify-start items-center gap-2 overflow-y-scroll">
            {updatedQuestion.answerOptions
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((answerOption, index) => {
                return (
                  <div
                    key={'answer-option_' + index}
                    className={`w-full flex flex-row items-center justify-between rounded-lg border border-gray-200 py-2 ${
                      updating &&
                      updatingValues.includes('removeAnswerOption') &&
                      updatingValues.includes('answerOption:' + answerOption._id)
                        ? 'opacity-50'
                        : ''
                    }`}>
                    <div className="h-12 w-16 flex items-center justify-center p-4 select-none">
                      <span
                        className="text-3xl font-medium text-purple-700"
                        style={{
                          color: CSS.supports('color', answerOption.color) ? answerOption.color : ''
                        }}>
                        {answerOption.order}
                      </span>
                    </div>
                    <div className="flex-grow h-32 flex flex-col items-start justify-center">
                      {answerPictureUrlsLoader.loading ? (
                        <span className="text-lg font-medium loading-dots">Bild lädt</span>
                      ) : answerOption.picture &&
                        answerOption.picture.fileName &&
                        answerOption.picture.fileName in answerPictureUrls ? (
                        <img
                          className="h-full py-2"
                          src={answerPictureUrls[answerOption.picture.fileName]}
                          alt="Bild der Antwortmöglichkeit"
                          onError={(event) => {
                            (event.nativeEvent.target as HTMLImageElement).alt =
                              'Bild konnte nicht geladen werden';
                          }}
                        />
                      ) : (
                        <span className="text-lg font-normal text-red-500">Noch kein Bild</span>
                      )}
                    </div>
                    {props.survey.draft && (
                      <div className="h-12 flex flex-row items-center justify-evenly gap-1 px-1">
                        <button
                          className="flex items-center justify-center rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 px-1 py-2 disabled:cursor-not-allowed"
                          disabled={updating || !props.survey.draft}
                          title="Antwortbild ändern"
                          onClick={() => {
                            changeAnswerOptionPicture(answerOption);
                          }}>
                          <FontAwesomeIcon
                            icon={faImage}
                            size="1x"
                            className="text-xl text-purple-800"
                            fixedWidth
                          />
                        </button>
                        <button
                          className="flex items-center justify-center rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 px-1 py-2 disabled:cursor-not-allowed"
                          disabled={updating || !props.survey.draft}
                          title="Farbe ändern"
                          onClick={() => {
                            changeAnswerOptionColor(answerOption);
                          }}>
                          <FontAwesomeIcon
                            icon={faPalette}
                            size="1x"
                            className="text-xl text-purple-800"
                            fixedWidth
                          />
                        </button>
                        <button
                          className="flex items-center justify-center rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 px-1 py-2 disabled:cursor-not-allowed"
                          disabled={updating || !props.survey.draft}
                          title="Antwortmöglichkeit löschen"
                          onClick={() => {
                            removeAnswerOption(answerOption);
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
          {props.survey.draft && (
            <div className="w-full flex flex-row items-center justify-start gap-2 mt-2">
              <button
                onClick={createAnswerOption}
                className={`px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
                  updating && updatingValues.includes('createAnswerOption')
                    ? 'loading-default-button'
                    : ''
                }`}
                disabled={updating || !props.survey.draft}
                title={
                  props.survey.draft
                    ? 'eine neue Antwortmöglichkeit erstellen'
                    : 'es kann keine Antwortmöglichkeit mehr zu der Frage hinzugefügt werden'
                }>
                Antwort hinzufügen
              </button>
              <button
                onClick={reorderAnswerOptions}
                className="px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
                disabled={updating || !props.survey.draft || question.answerOptions.length === 0}
                title={
                  props.survey.draft
                    ? 'Reihenfolge der Antwortmöglichkeiten ändern'
                    : 'Die Reihenfolge der Antwortmöglichkeiten kann nicht mehr geändert werden'
                }>
                Reihenfolge ändern
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* change answer-option picture modal */}
      {props.survey && question && (
        <AnswerOptionPictureModal
          survey={props.survey}
          question={question}
          ref={changeAnswerOptionPictureModalRef}
          containerRef={changeAnswerOptionPictureModalContainerRef}
          onUpdateAnswerOption={(answerOption: AnswerOption) => {
            const tempQuestion: Question = Object.assign({}, question);
            const answerOptionIndex = tempQuestion.answerOptions.findIndex(
              (q) => q.order === question.order
            );

            tempQuestion.answerOptions[answerOptionIndex] = answerOption;

            setQuestion(tempQuestion);
            setUpdatedQuestion(tempQuestion);
            props.onUpdateQuestion(tempQuestion);
          }}
        />
      )}

      {/* change answer-option color modal */}
      {props.survey && question && (
        <AnswerOptionColorModal
          survey={props.survey}
          question={question}
          ref={changeAnswerOptionColorModalRef}
          containerRef={changeAnswerOptionColorModalContainerRef}
          onUpdateAnswerOption={(answerOption: AnswerOption) => {
            const tempQuestion: Question = Object.assign({}, question);
            const answerOptionIndex = tempQuestion.answerOptions.findIndex(
              (q) => q.order === question.order
            );

            tempQuestion.answerOptions[answerOptionIndex] = answerOption;

            setQuestion(tempQuestion);
            setUpdatedQuestion(tempQuestion);
            props.onUpdateQuestion(tempQuestion);
          }}
        />
      )}

      {/* reorder questions modal */}
      {props.survey && question && (
        <ReorderAnswerOptionsModal
          survey={props.survey}
          question={question}
          ref={reorderAnswerOptionsModalRef}
          containerRef={reorderAnswerOptionsModalContainerRef}
          onUpdateAnswerOptionsOrder={(answerOptions) => {
            setQuestion({ ...question, answerOptions: answerOptions });
            setUpdatedQuestion({ ...question, answerOptions: answerOptions });
            props.onUpdateAnswerOptions(question, answerOptions);
          }}
        />
      )}
    </>
  );
};

export default forwardRef<QuestionModalRefAttributes, QuestionModalProps>(QuestionModal);
