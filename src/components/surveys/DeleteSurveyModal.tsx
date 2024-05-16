import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from '../layout/modal/Modal';
import { Survey } from '../../data/types/survey.types';
import SurveyService from '../../data/services/survey.service';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { useNavigate } from 'react-router-dom';
import VotingService from '../../data/services/voting.service';

type DeleteSurveyModalProps = {
  survey: Survey;
};

export type DeleteSurveyModalRefAttributes = {
  open: () => void;
};

const DeleteSurveyModal: ForwardRefRenderFunction<
  DeleteSurveyModalRefAttributes,
  DeleteSurveyModalProps
> = (props, ref) => {
  const navigate = useNavigate();
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [votingCount, setVotingCount] = useState<number>(-1);

  const [deleting, setDeleting] = useState<boolean>(false);

  useImperativeHandle<DeleteSurveyModalRefAttributes, DeleteSurveyModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
          setVotingCount(-1);
          setDeleting(false);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    if (visible) {
      // modal was opened
      VotingService.getVotingCount(props.survey._id).then((response) => {
        if (response.success) {
          setVotingCount(response.data.count);
        } else {
          setVotingCount(-1);
        }
      });
    }
  }, [visible]);

  const onClose = () => {
    if (visible && !deleting) {
      setVisible(false);
    }
  };

  const deleteSurvey: () => void = () => {
    setDeleting(true);

    SurveyService.removeSurvey(props.survey._id)
      .then((response) => {
        if (response.success) {
          toaster.sendToast('success', 'Die Umfrage wurde erfolgreich gelöscht.');

          navigate(-1);
        } else {
          setVisible(false);

          toaster.sendToast(
            'error',
            'Ein unbekannter Fehler ist beim Löschen der Umfrage aufgetreten.'
          );
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <Modal
      className="w-full"
      closeable={!deleting}
      onRequestClose={onClose}
      title="Umfrage löschen"
      visible={visible}>
      <div className="w-full flex flex-col">
        <span className="text-base text-black font-normal">
          Mit dem Löschen der Umfrage werden alle Daten zu dieser, inklusive aller bereits
          gespeicherten Abstimmungen gelöscht.
        </span>
        <span className="text-base text-black font-normal">
          Die genutzten Antwort-Bilder bleiben erhalten.
        </span>
        <br />
        <span className="text-base text-red-500 font-normal">
          Dieser Vorgang kann nicht rückgängig gemacht werden.
        </span>
        <br />
        <span className="text-base font-normal mt-4">
          Anzahl der Abstimmungen der Umfrage:{' '}
          <span
            className={
              votingCount === -1
                ? 'loading-dots'
                : votingCount === 0
                  ? 'font-semibold text-green-500'
                  : 'font-semibold text-red-500'
            }>
            {votingCount === -1 ? '' : votingCount}
          </span>
        </span>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed"
            disabled={deleting}
            onClick={deleteSurvey}
            title="Umfrage löschen">
            Löschen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<DeleteSurveyModalRefAttributes, DeleteSurveyModalProps>(
  DeleteSurveyModal
);
