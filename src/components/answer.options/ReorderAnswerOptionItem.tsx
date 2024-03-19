import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { AnswerOption } from '../../data/types/answer.option.types';

type ReorderAnswerOptionItemProps = {
  answerOption: AnswerOption;
};

const RawReorderAnswerOptionItem: (props: ReorderAnswerOptionItemProps) => React.JSX.Element = (
  props
) => {
  return (
    <div className="w-full flex flex-row items-center justify-between rounded-lg border border-gray-200 py-2 z-30">
      <div className="w-16 flex items-center justify-center select-none">
        <span className="text-xl font-semibold truncate text-purple-800 px-4">
          {props.answerOption.order}
        </span>
      </div>
      <div className="flex-grow flex flex-row items-center justify-start">
        <span
          className="text-lg"
          style={{
            color: CSS.supports('color', props.answerOption.color)
              ? props.answerOption.color
              : 'black'
          }}>
          Antwortmöglichkeit {props.answerOption.order}
        </span>
      </div>
    </div>
  );
};

const ReorderAnswerOptionItem = SortableElement<ReorderAnswerOptionItemProps>(
  RawReorderAnswerOptionItem
);

export default ReorderAnswerOptionItem;
