import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';
import SurveyService from '../../data/services/survey.service';
import { useNavigate } from 'react-router-dom';
import { APIError } from '../../data/types/common.types';

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
  const id = Math.random().toString(36).substring(2, 12);

  const navigate = useNavigate();

  const [visible, setVisible] = useState<boolean>(false);
  const [surveyName, setSurveyName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useImperativeHandle<CreateSurveyModalRefAttributes, CreateSurveyModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    setSurveyName('');

    if (visible) {
      setVisible(false);
    }
  };

  const createSurvey = () => {
    SurveyService.createSurvey({ name: surveyName }).then((response) => {
      if (response.success) {
        const surveyId = response.data.id;

        setErrorMessage('');
        setSurveyName('');
        setVisible(false);
        navigate('/surveys/' + surveyId);
      } else {
        const error = response.error as APIError;

        if (!error.hasFieldErrors) {
          setErrorMessage(error?.errorMessage);
        } else {
          if ('name' in error.fieldErrors) {
            setErrorMessage(error.fieldErrors.name);
          }
        }
      }
    });
  };

  return (
    <Modal closeable={true} onRequestClose={onClose} title="Umfrage erstellen" visible={visible}>
      <div className="w-full flex flex-col select-none">
        <div className="w-full flex flex-col">
          <label
            htmlFor={id}
            className="py-2 text-base font-medium"
            onClick={(event) => event.preventDefault()}>
            Name der Umfrage
          </label>
          <input
            autoFocus={true}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            id={id}
            onChange={(event) => {
              setErrorMessage('');
              setSurveyName(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                createSurvey();
              }
            }}
            placeholder="Name"
            value={surveyName}
          />
          {errorMessage && (
            <p className="p-1 pt-2 text-sm text-red-500 font-medium">{errorMessage}</p>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={createSurvey}
            title="Umfrage erstellen">
            Erstellen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<CreateSurveyModalRefAttributes, CreateSurveyModalProps>(
  CreateSurveyModal
);
