import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from '../layout/modal/Modal';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { useNavigate } from 'react-router-dom';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { AnswerPicture } from '../../data/types/answer.picture.types';

type DeleteAnswerPictureModalProps = {
  answerPicture: AnswerPicture;
};

export type DeleteAnswerPictureModalRefAttributes = {
  open: () => void;
};

const DeleteAnswerPictureModal: ForwardRefRenderFunction<
  DeleteAnswerPictureModalRefAttributes,
  DeleteAnswerPictureModalProps
> = (props, ref) => {
  const navigate = useNavigate();
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);

  const [isUsed, setIsUsed] = useState<boolean | undefined>(undefined);

  const [deleting, setDeleting] = useState<boolean>(false);

  useImperativeHandle<DeleteAnswerPictureModalRefAttributes, DeleteAnswerPictureModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
          setDeleting(false);
          setIsUsed(undefined);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    if (visible) {
      // modal was opened
      AnswerPictureService.getAnswerPictureStatus(props.answerPicture._id).then((response) => {
        if (response.success) {
          setIsUsed(response.data.used);
        } else {
          setIsUsed(undefined);
        }
      });
    }
  }, [visible]);

  const onClose = () => {
    if (visible && !deleting) {
      setVisible(false);
      setIsUsed(undefined);
    }
  };

  const deleteAnswerPicture: () => void = () => {
    setDeleting(true);

    AnswerPictureService.removeAnswerPicture(props.answerPicture._id)
      .then((response) => {
        if (response.success) {
          toaster.sendToast('success', 'Das Bild wurde erfolgreich gelöscht.');

          navigate(-1);
        } else {
          setVisible(false);

          toaster.sendToast(
            'error',
            'Ein unbekannter Fehler ist beim Löschen des Bildes aufgetreten.'
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
      title="Bild löschen"
      visible={visible}>
      <div className="w-full flex flex-col items-start justify-center">
        <span className="text-base text-black font-normal">
          Das Bild kann nur gelöscht werden, wenn es derzeit in keiner Umfrage genutzt wird.
        </span>
        <span className="text-base text-red-500 font-semibold mt-2">
          {isUsed
            ? 'Das Bild kann nicht gelöscht werden, da es derzeit in einer Umfrage genutzt wird.'
            : 'Das Bild kann gelöscht werden.'}
        </span>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed"
            disabled={deleting || isUsed === undefined || isUsed}
            onClick={deleteAnswerPicture}
            title="Bild löschen">
            Löschen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<DeleteAnswerPictureModalRefAttributes, DeleteAnswerPictureModalProps>(
  DeleteAnswerPictureModal
);
