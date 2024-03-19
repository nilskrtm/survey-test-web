import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';
import { Question, QuestionOrdering } from '../../data/types/question.types';
import { Survey } from '../../data/types/survey.types';
import ReorderQuestionList from './ReorderQuestionList';
import { arrayMove, SortEnd } from 'react-sortable-hoc';
import QuestionService from '../../data/services/question.service';
import useToasts from '../../utils/hooks/use.toasts.hook';

type ReorderQuestionsModalProps = {
  survey: Survey;
  onUpdateQuestionsOrder: (questions: Question[]) => void;
};

export type ReorderQuestionsModalRefAttributes = {
  open: (questions: Question[]) => void;
};

const ReorderQuestionsModal: ForwardRefRenderFunction<
  ReorderQuestionsModalRefAttributes,
  ReorderQuestionsModalProps
> = (props, ref) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [ordering, setOrdering] = useState<boolean>(false);

  useImperativeHandle<ReorderQuestionsModalRefAttributes, ReorderQuestionsModalRefAttributes>(
    ref,
    () => ({
      open: (questionsPayload) => {
        if (!visible && props.survey.draft) {
          setVisible(true);
          setOrdering(false);
          setQuestions([...questionsPayload].sort((a, b) => (a.order > b.order ? 1 : -1)));
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !ordering) {
      setVisible(false);
      setQuestions([]);
    }
  };

  const onSortEnd: (sort: SortEnd) => void = (sort) => {
    if (ordering) return;

    const newQuestions: Question[] = [];
    const indexSortedQuestions: Question[] = arrayMove(
      [...questions],
      sort.oldIndex,
      sort.newIndex
    );

    for (let i = 0; i < questions.length; i++) {
      const oldQuestion = indexSortedQuestions[i];
      const newQuestion: Question = {
        _id: oldQuestion._id,
        order: i + 1,
        question: oldQuestion.question,
        timeout: oldQuestion.timeout,
        answerOptions: oldQuestion.answerOptions
      };

      newQuestions.push(newQuestion);
    }

    setQuestions(newQuestions);
  };

  const saveOrdering: () => void = () => {
    const ordering: QuestionOrdering = {};

    questions.forEach((question) => {
      ordering[question._id] = question.order;
    });

    setOrdering(true);

    QuestionService.reorderQuestions(props.survey._id, ordering)
      .then((response) => {
        if (response.success) {
          toaster.sendToast('success', 'Die Fragen wurden erfolgreich sortiert.');
          setVisible(false);
          props.onUpdateQuestionsOrder(questions);
        } else {
          setQuestions([...props.survey.questions].sort((a, b) => (a.order > b.order ? 1 : -1)));

          toaster.sendToast(
            'error',
            'Ein unbekannter Fehler ist beim Sortieren der Fragen aufgetreten.'
          );
        }
      })
      .finally(() => {
        setOrdering(false);
      });
  };

  const orderingPending: () => boolean = () => {
    for (const question of props.survey.questions) {
      const questionIndex = questions.findIndex((q) => q._id === question._id);

      if (questionIndex !== -1) {
        if (question.order !== questions[questionIndex].order) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <Modal
      closeable={!ordering}
      onRequestClose={onClose}
      title={'Reihenfolge der Fragen'}
      visible={visible}>
      <div className="w-full flex flex-col items-start justify-center">
        <ReorderQuestionList
          questions={questions}
          onSortEnd={onSortEnd}
          lockAxis="y"
          disabled={!props.survey.draft || ordering}
        />
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className={`px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
              ordering ? 'loading-default-button' : ''
            }`}
            disabled={ordering || !orderingPending()}
            onClick={saveOrdering}
            title="Sortierung anwenden">
            Sortierung anwenden
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<ReorderQuestionsModalRefAttributes, ReorderQuestionsModalProps>(
  ReorderQuestionsModal
);
