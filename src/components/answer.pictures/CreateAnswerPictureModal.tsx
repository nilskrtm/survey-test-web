import React, {
  createRef,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState
} from 'react';
import Modal, { ModalProps } from '../layout/modal/Modal';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { AnswerPicture } from '../../data/types/answer.picture.types';
import { APIError } from '../../data/types/common.types';
import { useNavigate } from 'react-router-dom';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

type CreateAnswerPictureModalProps = Pick<ModalProps, 'containerRef'> & {
  onCreateAnswerPicture?: (answerPicture: AnswerPicture) => void;
};

export type CreateAnswerPictureModalRefAttributes = {
  open: () => void;
};

const CreateAnswerPictureModal: ForwardRefRenderFunction<
  CreateAnswerPictureModalRefAttributes,
  CreateAnswerPictureModalProps
> = (props, ref) => {
  const navigate = useNavigate();
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);

  const [answerPictureName, setAnswerPictureName] = useState<string>('');
  const [answerPictureFile, setAnswerPictureFile] = useState<File>();
  const [answerPictureNameErrorMessage, setAnswerPictureNameErrorMessage] = useState<string>('');
  const [answerPictureFileErrorMessage, setAnswerPictureFileErrorMessage] = useState<string>('');

  const fileInputRef = createRef<HTMLInputElement>();

  const [creating, setCreating] = useState<boolean>(false);

  useImperativeHandle<CreateAnswerPictureModalRefAttributes, CreateAnswerPictureModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
          setCreating(false);
          setAnswerPictureName('');
          setAnswerPictureFile(undefined);
          setAnswerPictureNameErrorMessage('');
          setAnswerPictureFileErrorMessage('');
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible && !creating) {
      setVisible(false);
      setCreating(false);
      setAnswerPictureName('');
      setAnswerPictureFile(undefined);
      setAnswerPictureNameErrorMessage('');
      setAnswerPictureFileErrorMessage('');
    }
  };

  const createAnswerPicture: () => void = () => {
    setCreating(true);
    setAnswerPictureNameErrorMessage('');
    setAnswerPictureFileErrorMessage('');

    AnswerPictureService.createAnswerPicture(
      answerPictureName && answerPictureName.trim()
        ? {
            name: answerPictureName.trim(),
            file: answerPictureFile as File
          }
        : {
            file: answerPictureFile as File
          }
    )
      .then((response) => {
        if (response.success) {
          const answerPictureId = response.data.id;

          setCreating(false);
          setAnswerPictureNameErrorMessage('');
          setAnswerPictureFileErrorMessage('');
          setAnswerPictureName('');
          setAnswerPictureFile(undefined);
          setVisible(false);

          navigate('/answer-pictures/' + answerPictureId);
        } else {
          const error = response.error as APIError;

          if (!error.hasFieldErrors) {
            toaster.sendToast(
              'error',
              error.errorMessage ||
                'Beim erstellen des Bildes ist ein unbekannter Fehler aufgetreten.'
            );
          } else {
            if ('name' in error.fieldErrors) {
              setAnswerPictureNameErrorMessage(error.fieldErrors.name);
            }
            if ('file' in error.fieldErrors) {
              setAnswerPictureFileErrorMessage(error.fieldErrors.file);
            }
          }
        }
      })
      .finally(() => {
        setCreating(false);
      });
  };

  return (
    <Modal
      className="w-full"
      containerRef={props.containerRef}
      closeable={!creating}
      onRequestClose={onClose}
      title="Bild erstellen"
      visible={visible}>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-col">
          <label
            htmlFor="answerPicture_name"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            Name des Bildes
          </label>
          <input
            autoFocus={true}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            disabled={creating}
            id="answerPicture_name"
            onChange={(event) => {
              setAnswerPictureNameErrorMessage('');
              setAnswerPictureName(event.target.value);
            }}
            placeholder="Name"
            value={answerPictureName}
          />
          {answerPictureNameErrorMessage && (
            <p className="p-1 pt-2 text-sm text-red-500 font-medium">
              {answerPictureNameErrorMessage}
            </p>
          )}
        </div>
        <div className="w-full flex flex-col">
          <label
            htmlFor="answerPicture_file"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            Bild
          </label>
          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="relative w-full bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <label className="w-full px-3 py-2.5 flex flex-row items-center justify-center gap-2 cursor-pointer">
              <FontAwesomeIcon icon={faImage} size="1x" className="text-lg" />
              <span className="max-w-fit text-base truncate">
                {answerPictureFile ? answerPictureFile.name : 'Bild wählen'}
              </span>
            </label>
            <input
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files?.item(0);

                if (file) {
                  const fileSize = file.size;

                  if (fileSize > 10000000) {
                    toaster.sendToast('warning', 'Das Bild ist größer als 10 mb.');
                    setAnswerPictureFile(undefined);

                    return;
                  }

                  setAnswerPictureFile(file);
                }
              }}
              id="answerPicture_file"
              type="file"
              accept="image/jpeg,
          image/png"
              className="absolute top-0 left-0 w-full h-full hidden"
            />
          </button>
          {answerPictureFileErrorMessage && (
            <p className="p-1 pt-2 text-sm text-red-500 font-medium">
              {answerPictureFileErrorMessage}
            </p>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:loading-button"
            disabled={creating}
            onClick={createAnswerPicture}
            title="Bild erstellen">
            Erstellen
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<CreateAnswerPictureModalRefAttributes, CreateAnswerPictureModalProps>(
  CreateAnswerPictureModal
);
