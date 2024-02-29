import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';

type CreateSurveyModalProps = {
  //
};

export type CreateSurveyModalRefAttributes = {
  open: () => void;
};

const CreateSurveyModal: ForwardRefRenderFunction<
  CreateSurveyModalRefAttributes,
  CreateSurveyModalProps
> = (_props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const clickOutside = () => {
    if (visible) {
      setVisible(false);
    }
  };

  useImperativeHandle<CreateSurveyModalRefAttributes, CreateSurveyModalRefAttributes>(
    ref,
    () => ({
      open() {
        if (!visible) {
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  return (
    <Modal onClickOutside={clickOutside} visible={visible}>
      Umfrage erstellen
    </Modal>
  );
};

export default forwardRef<CreateSurveyModalRefAttributes, CreateSurveyModalProps>(
  CreateSurveyModal
);
