import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from '../layout/modal/Modal';
import { Survey } from '../../data/types/survey.types';
import { APIError } from '../../data/types/common.types';
import SurveyService from '../../data/services/survey.service';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { isSurveyFinalizeable } from '../../utils/surveys/surveys.util';
import moment from 'moment/moment';

type FinalizeSurveyModalProps = {
  survey: Survey;
  onFinalized: (success: boolean, finalizedSurvey?: Survey) => void;
};

export type FinalizeSurveyModalRefAttributes = {
  open: () => void;
};

const FinalizeSurveyModal: ForwardRefRenderFunction<
  FinalizeSurveyModalRefAttributes,
  FinalizeSurveyModalProps
> = (props, ref) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [finalizeable, setFinalizeable] = useState<boolean>(false);
  const [finalizing, setFinalizing] = useState<boolean>(false);

  useImperativeHandle<FinalizeSurveyModalRefAttributes, FinalizeSurveyModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
          setFinalizing(false);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    if (visible) {
      // modal was opened
      setFinalizeable(isSurveyFinalizeable(props.survey));
    }
  }, [visible]);

  const onClose = () => {
    if (visible && !finalizing) {
      setVisible(false);
      setFinalizeable(false);

      props.onFinalized(false);
    }
  };

  const finalizeSurvey: () => void = () => {
    setFinalizing(true);

    SurveyService.finalizeSurvey(props.survey._id)
      .then((response) => {
        if (response.success) {
          setVisible(false);
          props.onFinalized(true, { ...props.survey, draft: false });
        } else {
          setVisible(false);
          props.onFinalized(false);

          const error = response.error as APIError;

          if (error.hasFieldErrors) {
            toaster.sendToast('error', error.errorMessage);
          } else {
            toaster.sendToast(
              'error',
              'Ein unbekannter Fehler ist beim Finalisieren der Umfrage aufgetreten.'
            );
          }
        }
      })
      .finally(() => {
        setFinalizing(false);
      });
  };

  return (
    <Modal
      closeable={!finalizing}
      onRequestClose={onClose}
      title="Umfrage finalisieren"
      visible={visible}>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col justify-center items-start gap-4">
          <span className="">
            Nach dem Finalisieren der Umfrage können an dieser keine Änderungen mehr vorgenommen
            werden. Sie kann erst nach der Finalisierung aktiv für Abstimmungen genutzt werden.
          </span>
          {!finalizeable ? (
            <span className="text-base text-red-500 font-normal">
              Die Umfrage kann nicht finalisiert werden:{' '}
              <span className="font-medium">
                Bitte überprüfen Sie alle Daten der Umfrage und Fragen in dieser auf Richtigkeit und
                Vollständigkeit.
              </span>
            </span>
          ) : (
            <span className="text-base text-green-500 font-normal">
              Die Umfrage kann bis zu dem{' '}
              <span className="font-medium">
                {moment(props.survey.startDate).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr'}
              </span>{' '}
              finalisiert werden.
            </span>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed"
            disabled={!finalizeable || finalizing}
            onClick={finalizeSurvey}
            title="Umfrage erstellen">
            Finalisieren
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<FinalizeSurveyModalRefAttributes, FinalizeSurveyModalProps>(
  FinalizeSurveyModal
);
