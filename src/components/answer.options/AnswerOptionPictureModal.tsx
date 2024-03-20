import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal, { ModalProps } from '../layout/modal/Modal';
import { Question } from '../../data/types/question.types';
import { Survey } from '../../data/types/survey.types';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { AnswerOption } from '../../data/types/answer.option.types';
import { dummyAnswerOption } from '../../utils/surveys/surveys.util';

type AnswerOptionPictureModalProps = Pick<ModalProps, 'containerRef'> & {
  survey: Survey;
  question: Question;
  onUpdateAnswerOption: (answerOption: AnswerOption) => void;
};

export type AnswerOptionPictureModalRefAttributes = {
  open: (answerOption: AnswerOption) => void;
};

const AnswerOptionPictureModal: ForwardRefRenderFunction<
  AnswerOptionPictureModalRefAttributes,
  AnswerOptionPictureModalProps
> = (props, ref) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [answerOption, setAnswerOption] = useState<AnswerOption>(dummyAnswerOption());
  const [updateAnswerOption, setUpdateAnswerOption] = useState<AnswerOption>(dummyAnswerOption());

  const [updating, setUpdating] = useState<boolean>(false);

  useImperativeHandle<AnswerOptionPictureModalRefAttributes, AnswerOptionPictureModalRefAttributes>(
    ref,
    () => ({
      open: (answerOption) => {
        if (!visible && props.survey.draft) {
          setVisible(true);
          setUpdating(false);
          setAnswerOption(answerOption);
          setUpdateAnswerOption(dummyAnswerOption());
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !updating) {
      setVisible(false);
      setUpdating(false);
      setAnswerOption(dummyAnswerOption());
      setUpdateAnswerOption(dummyAnswerOption());
    }
  };

  return (
    <Modal
      className="w-full"
      containerRef={props.containerRef}
      closeable={!updating}
      onRequestClose={onClose}
      title="Bild der Antwortmöglichkeit"
      visible={visible}>
      <div className="w-full"></div>
    </Modal>
  );
};

export default forwardRef<AnswerOptionPictureModalRefAttributes, AnswerOptionPictureModalProps>(
  AnswerOptionPictureModal
);
