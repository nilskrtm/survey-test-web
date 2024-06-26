import { Question } from '../../data/types/question.types';
import React from 'react';
import ReorderQuestionItem from './ReorderQuestionItem';
import { SortableContainer } from 'react-sortable-hoc';

type ReorderQuestionListProps = {
  disabled?: boolean;
  questions: Question[];
};

const RawReorderQuestionList: (props: ReorderQuestionListProps) => React.JSX.Element = (props) => {
  return (
    <div className="w-full max-h-72 lg:max-h-96 flex flex-col items-center justify-start gap-2 overflow-y-auto">
      {props.questions.map((question, index) => {
        return (
          <ReorderQuestionItem
            key={'question_' + index}
            index={index}
            question={question}
            disabled={props.disabled}
          />
        );
      })}
    </div>
  );
};

const ReorderQuestionList = SortableContainer<ReorderQuestionListProps>(RawReorderQuestionList);

export default ReorderQuestionList;
