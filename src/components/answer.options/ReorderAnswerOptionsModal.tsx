import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal, { ModalProps } from '../layout/modal/Modal';
import { Question } from '../../data/types/question.types';
import { Survey } from '../../data/types/survey.types';
import ReorderAnswerOptionList from './ReorderAnswerOptionList';
import { arrayMove, SortEnd } from 'react-sortable-hoc';
import useToasts from '../../utils/hooks/use.toasts.hook';
import AnswerOptionsService from '../../data/services/answer.options.service';
import { AnswerOption, AnswerOptionOrdering } from '../../data/types/answer.option.types';

type ReorderAnswerOptionsModalProps = Pick<ModalProps, 'containerRef'> & {
  survey: Survey;
  question: Question;
  onUpdateAnswerOptionsOrder: (answerOptions: AnswerOption[]) => void;
};

export type ReorderAnswerOptionsModalRefAttributes = {
  open: (answerOptions: AnswerOption[]) => void;
};

const ReorderAnswerOptionsModal: ForwardRefRenderFunction<
  ReorderAnswerOptionsModalRefAttributes,
  ReorderAnswerOptionsModalProps
> = (props, ref) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

  const [ordering, setOrdering] = useState<boolean>(false);

  useImperativeHandle<
    ReorderAnswerOptionsModalRefAttributes,
    ReorderAnswerOptionsModalRefAttributes
  >(
    ref,
    () => ({
      open: (answerOptionsPayload) => {
        if (!visible && props.survey.draft) {
          setVisible(true);
          setOrdering(false);
          setAnswerOptions([...answerOptionsPayload].sort((a, b) => (a.order > b.order ? 1 : -1)));
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !ordering) {
      setVisible(false);
      setAnswerOptions([]);
    }
  };

  const onSortEnd: (sort: SortEnd) => void = (sort) => {
    if (ordering) return;

    const newAnswerOptions: AnswerOption[] = [];
    const indexSortedAnswerOptions: AnswerOption[] = arrayMove(
      [...answerOptions],
      sort.oldIndex,
      sort.newIndex
    );

    for (let i = 0; i < answerOptions.length; i++) {
      const oldAnswerOption = indexSortedAnswerOptions[i];
      const newAnswerOption: AnswerOption = {
        _id: oldAnswerOption._id,
        order: i + 1,
        picture: oldAnswerOption.picture,
        color: oldAnswerOption.color
      };

      newAnswerOptions.push(newAnswerOption);
    }

    setAnswerOptions(newAnswerOptions);
  };

  const saveOrdering: () => void = () => {
    const ordering: AnswerOptionOrdering = {};

    answerOptions.forEach((answerOption) => {
      ordering[answerOption._id] = answerOption.order;
    });

    setOrdering(true);

    AnswerOptionsService.reorderAnswerOptions(props.survey._id, props.question._id, ordering)
      .then((response) => {
        if (response.success) {
          toaster.sendToast('success', 'Die Antwortmöglichkeiten wurden erfolgreich sortiert.');
          setVisible(false);
          props.onUpdateAnswerOptionsOrder(answerOptions);
        } else {
          setAnswerOptions(
            [...props.question.answerOptions].sort((a, b) => (a.order > b.order ? 1 : -1))
          );

          toaster.sendToast(
            'error',
            'Ein unbekannter Fehler ist beim Sortieren der Antwortmöglichkeiten aufgetreten.'
          );
        }
      })
      .finally(() => {
        setOrdering(false);
      });
  };

  const orderingPending: () => boolean = () => {
    for (const answerOption of props.question.answerOptions) {
      const answerOptionIndex = answerOptions.findIndex((aw) => aw._id === answerOption._id);

      if (answerOptionIndex !== -1) {
        if (answerOption.order !== answerOptions[answerOptionIndex].order) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <Modal
      containerRef={props.containerRef}
      closeable={!ordering}
      onRequestClose={onClose}
      title={'Reihenfolge der Antwortmöglichkeiten'}
      visible={visible}>
      <div className="w-full flex flex-col items-start justify-center">
        <ReorderAnswerOptionList
          answerOptions={answerOptions}
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

export default forwardRef<ReorderAnswerOptionsModalRefAttributes, ReorderAnswerOptionsModalProps>(
  ReorderAnswerOptionsModal
);
