import React from 'react';
import ReorderAnswerOptionItem from './ReorderAnswerOptionItem';
import { SortableContainer } from 'react-sortable-hoc';
import { AnswerOption } from '../../data/types/answer.option.types';

type ReorderAnswerOptionListProps = {
  answerOptions: AnswerOption[];
  disabled?: boolean;
};

const RawReorderAnswerOptionList: (props: ReorderAnswerOptionListProps) => React.JSX.Element = (
  props
) => {
  return (
    <div className="w-full max-h-72 lg:max-h-96 flex flex-col items-center justify-start gap-2 overflow-y-auto">
      {props.answerOptions.map((answerOption, index) => {
        return (
          <ReorderAnswerOptionItem
            key={'answerOption_' + index}
            index={index}
            answerOption={answerOption}
            disabled={props.disabled}
          />
        );
      })}
    </div>
  );
};

const ReorderAnswerOptionList = SortableContainer<ReorderAnswerOptionListProps>(
  RawReorderAnswerOptionList
);

export default ReorderAnswerOptionList;
