import React, {
  createRef,
  forwardRef,
  ForwardRefRenderFunction,
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

type QuestionModalProps = {
  survey: Survey;
  onUpdateQuestion: (question: Question) => void;
};

export type QuestionModalRefAttributes = {
  open: (question: Question) => void;
};

const cleanUpdatedQuestion: (question: Question) => Pick<Question, 'question' | 'timeout'> = (
  question
) => {
  return {
    question: question.question,
    timeout: question.timeout
  };
};

const QuestionModal: ForwardRefRenderFunction<QuestionModalRefAttributes, QuestionModalProps> = (
  props,
  ref
) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question>(dummyQuestion());
  const [updatedQuestion, setUpdatedQuestion] = useState<Pick<Question, 'question' | 'timeout'>>(
    cleanUpdatedQuestion(dummyQuestion())
  );

  const [updating, setUpdating] = useState<boolean>(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);

  const questionQuestionRef = createRef<HTMLSpanElement>();
  const questionTimeoutRef = createRef<HTMLSpanElement>();

  useImperativeHandle<QuestionModalRefAttributes, QuestionModalRefAttributes>(
    ref,
    () => ({
      open: (question) => {
        if (!visible) {
          setQuestion(question);
          setUpdatedQuestion(cleanUpdatedQuestion(question));
          setUpdating(false);
          setUpdatingValues([]);
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !updating) {
      setVisible(false);
      setUpdating(false);
      setUpdatingValues([]);
      setQuestion(dummyQuestion());
      setUpdatedQuestion(cleanUpdatedQuestion(dummyQuestion()));
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

  return (
    <Modal
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
        <div className="w-full flex-col justify-start items-center">
          {question.answerOptions.map((answerOption, index) => {
            return <div key={'answer-option_' + index}></div>;
          })}
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<QuestionModalRefAttributes, QuestionModalProps>(QuestionModal);
