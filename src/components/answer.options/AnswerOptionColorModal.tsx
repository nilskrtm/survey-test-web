import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal, { ModalProps } from '../layout/modal/Modal';
import { Question } from '../../data/types/question.types';
import { Survey } from '../../data/types/survey.types';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { AnswerOption } from '../../data/types/answer.option.types';
import { dummyAnswerOption } from '../../utils/surveys/surveys.util';
import ImageColorPicker from '../layout/colors/ImageColorPicker';
import AnswerPictureService from '../../data/services/answer.picture.service';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import AnswerOptionsService from '../../data/services/answer.options.service';
import ColorPicker from '../layout/colors/ColorPicker';

type AnswerOptionColorModalProps = Pick<ModalProps, 'containerRef'> & {
  survey: Survey;
  question: Question;
  onUpdateAnswerOption: (answerOption: AnswerOption) => void;
};

export type AnswerOptionColorModalRefAttributes = {
  open: (answerOption: AnswerOption) => void;
};

const AnswerOptionColorModal: ForwardRefRenderFunction<
  AnswerOptionColorModalRefAttributes,
  AnswerOptionColorModalProps
> = (props, ref) => {
  const toaster = useToasts();

  const [visible, setVisible] = useState<boolean>(false);
  const [answerOption, setAnswerOption] = useState<AnswerOption>(dummyAnswerOption());
  const [updateAnswerOption, setUpdateAnswerOption] = useState<AnswerOption>(dummyAnswerOption());

  const [colorPickerType, setColorPickerType] = useState<'field' | 'image'>('field');
  const answerPictureUrlLoader = useLoader();
  const [answerPictureUrl, setAnswerPictureUrl] = useState<string>('');

  const [updating, setUpdating] = useState<boolean>(false);

  useImperativeHandle<AnswerOptionColorModalRefAttributes, AnswerOptionColorModalRefAttributes>(
    ref,
    () => ({
      open: (answerOption) => {
        if (!visible && props.survey.draft) {
          setVisible(true);
          setUpdating(false);
          setColorPickerType('field');
          answerPictureUrlLoader.set(LoadingOption.RESET);
          setAnswerPictureUrl('');
          setAnswerOption(answerOption);
          setUpdateAnswerOption(answerOption);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    if (visible) {
      // modal was opened
      if (!answerOption.picture || !answerOption.picture.fileName) {
        setAnswerPictureUrl('');

        return;
      }

      answerPictureUrlLoader.set(LoadingOption.LOADING);

      AnswerPictureService.getAnswerPictureUrls([answerOption.picture.fileName]).then(
        (response) => {
          if (response.success) {
            setAnswerPictureUrl(response.data.urls[answerOption.picture.fileName]);
            answerPictureUrlLoader.set(LoadingOption.RESET);
          } else {
            setAnswerPictureUrl('');
            answerPictureUrlLoader.set(LoadingOption.ERROR);

            toaster.sendToast('error', 'Fehler beim Ändern der Farbe der Antwortmöglichkeit.');
          }
        }
      );
    }
  }, [visible]);

  const onClose = () => {
    if (visible && !updating) {
      setVisible(false);
      setUpdating(false);
      setAnswerOption(dummyAnswerOption());
      setUpdateAnswerOption(dummyAnswerOption());
      setAnswerPictureUrl('');
      answerPictureUrlLoader.set(LoadingOption.RESET);
      setColorPickerType('field');
    }
  };

  const onPickColor: (color: string) => void = (color) => {
    setUpdateAnswerOption({ ...answerOption, color: color });
  };

  const updateColor: () => void = () => {
    setUpdating(true);

    AnswerOptionsService.updateAnswerOption(
      props.survey._id,
      props.question._id,
      answerOption._id,
      { color: updateAnswerOption.color }
    )
      .then((response) => {
        if (response.success) {
          setAnswerOption({ ...answerOption, ...updateAnswerOption });
          setUpdateAnswerOption({ ...answerOption, ...updateAnswerOption });
          onClose();
          props.onUpdateAnswerOption({ ...answerOption, ...updateAnswerOption });
        } else {
          setUpdateAnswerOption(answerOption);
        }
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <Modal
      containerRef={props.containerRef}
      closeable={!updating}
      onRequestClose={onClose}
      title="Farbe der Antwortmöglichkeit"
      visible={visible}>
      <div className="w-full flex flex-col items-center justify-start">
        {answerPictureUrlLoader.loading &&
          !answerPictureUrlLoader.error &&
          colorPickerType === 'image' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <BounceLoader color="rgb(126 34 206)" size={70} />
              <p className="text-medium font-medium text-gray-700">Laden des Bildes</p>
            </div>
          )}
        {!answerPictureUrlLoader.loading &&
          answerPictureUrlLoader.error &&
          colorPickerType === 'image' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
              <p className="text-medium font-medium text-gray-700">
                Abruf des Bildes nicht möglich
              </p>
            </div>
          )}
        {!answerPictureUrlLoader.loading &&
          !answerPictureUrlLoader.error &&
          colorPickerType === 'image' && (
            <div className="w-full flex flex-row items-center justify-center p-2 my-1">
              <ImageColorPicker
                className="w-auto h-auto max-h-52 object-contain ring-1 ring-black"
                imageUrl={answerPictureUrl}
                onPickColor={onPickColor}
                useCacheBreak={true}
              />
            </div>
          )}
        {colorPickerType === 'field' && (
          <div className="w-full flex flex-row items-center justify-center p-2 my-1">
            <ColorPicker
              className="w-auto h-auto max-h-52 object-contain ring-1 ring-black"
              onPickColor={onPickColor}
            />
          </div>
        )}
        <div className="w-full flex flex-row items-center justify-between">
          <span className="text-lg font-medium">Farbe:</span>
          <div
            className="p-3 rounded-lg border-2 border-black mx-1"
            style={{ backgroundColor: answerOption.color }}></div>
        </div>
        <div className="w-full flex flex-row items-center justify-between mt-2">
          <span className="text-lg font-medium">Neue Farbe:</span>
          <div
            className="p-3 rounded-lg border-2 border-black mx-1"
            style={{ backgroundColor: updateAnswerOption.color }}></div>
        </div>
        <div className="w-full flex flex-row items-center justify-between mt-2">
          <span className="text-lg font-medium">Auswahl:</span>
          <div className="flex-grow flex flex-row items-center justify-end gap-2 mx-1">
            <div className="flex flex-row items-center justify-center gap-2">
              <input
                type="checkbox"
                checked={colorPickerType === 'image'}
                readOnly
                onClick={() => {
                  setColorPickerType('image');
                }}
                disabled={!answerOption.picture || !answerOption.picture.fileName}
                className={`form-checkbox pr-2 rounded-md border-gray-300 checked:accent-purple-800 checked:bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                  colorPickerType === 'image' ? '!bg-purple-800 !accent-purple-800' : ''
                }`}
              />
              <p className="font-normal text-lg">Bild</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <input
                type="checkbox"
                checked={colorPickerType === 'field'}
                readOnly
                onClick={() => {
                  setColorPickerType('field');
                }}
                className={`form-checkbox pr-2 rounded-md border-gray-300 checked:accent-purple-800 checked:bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                  colorPickerType === 'field' ? '!bg-purple-800 !accent-purple-800' : ''
                }`}
              />
              <p className="font-normal text-lg">Farbfeld</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className={`px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
              updating ? 'loading-button' : ''
            }`}
            disabled={updating}
            onClick={updateColor}
            title="Farbe speichern">
            Speichern
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<AnswerOptionColorModalRefAttributes, AnswerOptionColorModalProps>(
  AnswerOptionColorModal
);
