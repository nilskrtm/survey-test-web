import { Question } from '../../data/types/question.types';
import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

type ReorderQuestionItemProps = {
  question: Question;
};

const RawReorderQuestionItem: (props: ReorderQuestionItemProps) => React.JSX.Element = (props) => {
  return (
    <div className="w-full flex flex-row items-center justify-between rounded-lg border border-gray-200 py-2 z-30">
      <div className="w-16 flex items-center justify-center select-none">
        <span className="text-xl font-medium truncate text-purple-800 px-4">
          {props.question.order}
        </span>
      </div>
      <div className="flex-grow flex flex-row items-center justify-start">
        <span className="text-lg">{props.question.question}</span>
      </div>
    </div>
  );
};

const ReorderQuestionItem = SortableElement<ReorderQuestionItemProps>(RawReorderQuestionItem);

export default ReorderQuestionItem;
