import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';
import SurveyService from '../../data/services/survey.service';
import { LoadingOption } from '../../utils/hooks/use.loader';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [visible, setVisible] = useState<boolean>(false);

  const [surveyName, setSurveyName] = useState<string>('');

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

  const clickOutside = () => {
    if (visible) {
      setVisible(false);
    }
  };

  const createSurvey = () => {
    SurveyService.createSurvey({ name: surveyName }).then((response) => {
      if (response.success) {
        const { surveyId } = response.data;

        navigate('/survey/' + surveyId);
      } else {
        alert('error');
      }
    });
  };

  return (
    <Modal
      closeable={true}
      onRequestClose={clickOutside}
      title="Umfrage erstellen"
      visible={visible}>
      <div className="w-full flex">Umfrage</div>
    </Modal>
  );
};

export default forwardRef<CreateSurveyModalRefAttributes, CreateSurveyModalProps>(
  CreateSurveyModal
);
