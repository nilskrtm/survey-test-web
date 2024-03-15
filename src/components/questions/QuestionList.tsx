import React, { createRef, useState } from 'react';
import { Question } from '../../data/types/question.types';
import { DraggableProps, DragHandlers, Reorder, useDragControls } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type QuestionItemProps = Pick<DragHandlers, 'onDragEnd'> & {
  question: Question;
};

const QuestionItem: (props: QuestionItemProps) => React.JSX.Element = (props) => {
  const [dragging, setDragging] = useState<boolean>(false);

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      className="w-full flex flex-row items-center justify-between rounded-lg border border-gray-200 py-2"
      dragControls={dragControls}
      dragListener={false}
      onDragStart={() => {
        setDragging(true);
      }}
      onDragEnd={(event, info) => {
        setDragging(false);

        if (props.onDragEnd) {
          props.onDragEnd(event, info);
        }
      }}
      value={props.question}>
      <div className="h-12 w-16 flex items-center justify-center p-4 select-none">
        <span className="text-3xl font-medium text-purple-500">{props.question.order}</span>
      </div>
      <div className="flex-grow flex flex-col items-start justify-center">
        <span className="text-lg">{props.question.question}</span>
        <span className="text-base">
          {props.question.answerOptions.length} Antwortmöglichkeit
          {props.question.answerOptions.length !== 1 ? 'en' : ''}
        </span>
      </div>
      <div
        className={`max-h-max max-w-max flex items-center justify-center p-4 select-none ${
          dragging ? 'cursor-grabbing' : ''
        }`}
        onPointerDown={(event) => dragControls.start(event)}>
        <FontAwesomeIcon icon={faBars} size="1x" className="text-3xl" />
      </div>
    </Reorder.Item>
  );
};

type QuestionListProps = Pick<DraggableProps, 'dragConstraints'> &
  Pick<DragHandlers, 'onDragEnd'> & {
    questions: Question[];
    onQuestionsReorder: (newQuestions: Question[]) => void;
  };

const QuestionList: (props: QuestionListProps) => React.JSX.Element = (props) => {
  const orderedQuestions: Question[] = props.questions.sort((a, b) => (a.order > b.order ? 1 : -1));

  const ownRef = createRef<HTMLDivElement>();

  const onQuestionReorder: (newQuestions: Question[]) => void = (newQuestions) => {
    const reorderedQuestions = [...newQuestions];

    for (let i = 0; i < reorderedQuestions.length; i++) {
      reorderedQuestions[i].order = i + 1;
    }

    props.onQuestionsReorder(reorderedQuestions);
  };

  return (
    <Reorder.Group
      as="div"
      axis="y"
      className="w-full flex flex-col items-center justify-center gap-2 overflow-y-hidden"
      dragConstraints={props.dragConstraints !== undefined ? props.dragConstraints : ownRef}
      layoutScroll={true}
      onReorder={onQuestionReorder}
      ref={ownRef}
      values={orderedQuestions}>
      {orderedQuestions.map((question, index) => {
        return (
          <QuestionItem key={'question_' + index} onDragEnd={props.onDragEnd} question={question} />
        );
      })}
    </Reorder.Group>
  );
};

export default QuestionList;
