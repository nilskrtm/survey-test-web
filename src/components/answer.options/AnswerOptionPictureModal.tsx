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
import { AnswerOption } from '../../data/types/answer.option.types';
import { dummyAnswerOption } from '../../utils/surveys/surveys.util';
import AnswerOptionsService from '../../data/services/answer.options.service';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import AnswerPictureService from '../../data/services/answer.picture.service';
import usePagination from '../../utils/hooks/use.pagination.hook';
import { AnswerPicture, AnswerPictureUrls } from '../../data/types/answer.picture.types';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';

type AnswerOptionPictureModalProps = Pick<ModalProps, 'containerRef'> & {
  survey: Survey;
  question: Question;
  onUpdateAnswerOption: (answerOption: AnswerOption, answerPictureUrl?: string) => void;
};

export type AnswerOptionPictureModalRefAttributes = {
  open: (answerOptionId: string) => void;
};

const AnswerOptionPictureModal: ForwardRefRenderFunction<
  AnswerOptionPictureModalRefAttributes,
  AnswerOptionPictureModalProps
> = (props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [answerOptionId, setAnswerOptionId] = useState<string>('');
  const [answerOption, setAnswerOption] = useState<AnswerOption>(dummyAnswerOption());
  const [updateAnswerOption, setUpdateAnswerOption] = useState<AnswerOption>(dummyAnswerOption());
  const [updating, setUpdating] = useState<boolean>(false);

  const loader = useLoader();
  const pagination = usePagination(10);
  const [searchText, setSearchText] = useState<string>('');
  const [answerPictures, setAnswerPictures] = useState<Array<AnswerPicture>>([]);
  const [answerPictureUrls, setAnswerPictureUrls] = useState<AnswerPictureUrls>({});

  useImperativeHandle<AnswerOptionPictureModalRefAttributes, AnswerOptionPictureModalRefAttributes>(
    ref,
    () => ({
      open: (answerOptionId) => {
        if (!visible && props.survey.draft) {
          setAnswerOptionId(answerOptionId);

          const searchAnswerOption = props.question.answerOptions.find(
            (answerOption) => answerOption._id === answerOptionId
          );

          if (!searchAnswerOption) return;

          setVisible(true);
          setUpdating(false);
          setAnswerOption(searchAnswerOption);
          setUpdateAnswerOption(searchAnswerOption);
          setSearchText('');
          pagination.reset();
          loader.set(LoadingOption.RESET);
          loadAnswerPictures(1, '', false);
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    const searchAnswerOption = props.question.answerOptions.find(
      (answerOption) => answerOption._id === answerOptionId
    );

    if (!searchAnswerOption) return;

    setAnswerOption(searchAnswerOption);
    setUpdateAnswerOption(searchAnswerOption);
  }, [props.question]);

  const onClose = () => {
    if (visible && !updating) {
      setVisible(false);
      setUpdating(false);
      setAnswerOptionId('');
      setAnswerOption(dummyAnswerOption());
      setUpdateAnswerOption(dummyAnswerOption());
      setSearchText('');
      pagination.reset();
      loader.set(LoadingOption.RESET);
    }
  };

  const loadAnswerPictures: (requestedPage: number, search: string, append: boolean) => void = (
    requestedPage,
    search,
    append
  ) => {
    loader.set(LoadingOption.LOADING);

    AnswerPictureService.getAnswerPictures(requestedPage, pagination.perPage, {
      keyword: search
    }).then((response) => {
      if (response.success) {
        AnswerPictureService.getAnswerPictureUrls(
          response.data.answerPictures
            .filter((answerPicture) => 'fileName' in answerPicture && answerPicture.fileName)
            .map((answerPicture) => answerPicture.fileName)
        ).then((answerPictureUrlsResponse) => {
          if (answerPictureUrlsResponse.success) {
            if (append) {
              setAnswerPictures((prev) => [...prev, ...response.data.answerPictures]);
              setAnswerPictureUrls((prev) =>
                Object.assign({}, prev, answerPictureUrlsResponse.data.urls)
              );
            } else {
              setAnswerPictures(response.data.answerPictures);
              setAnswerPictureUrls(answerPictureUrlsResponse.data.urls);
            }

            pagination.update(response.data.paging, response.data.answerPictures.length);
            loader.set(LoadingOption.RESET);
          } else {
            loader.set(LoadingOption.ERROR);
          }
        });
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  const updatePicture: () => void = () => {
    setUpdating(true);

    AnswerOptionsService.updateAnswerOption(
      props.survey._id,
      props.question._id,
      answerOption._id,
      { picture: updateAnswerOption.picture._id }
    )
      .then((response) => {
        if (response.success) {
          setAnswerOption({ ...answerOption, ...updateAnswerOption });
          setUpdateAnswerOption({ ...answerOption, ...updateAnswerOption });
          onClose();

          if (updateAnswerOption.picture.fileName in answerPictureUrls) {
            props.onUpdateAnswerOption(
              { ...answerOption, ...updateAnswerOption },
              answerPictureUrls[updateAnswerOption.picture.fileName]
            );
          } else {
            props.onUpdateAnswerOption({ ...answerOption, ...updateAnswerOption });
          }
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
      className="w-full"
      containerRef={props.containerRef}
      closeable={!updating}
      level={1}
      onRequestClose={onClose}
      title="Bild der Antwortmöglichkeit"
      visible={visible}>
      <div className="w-full flex flex-col items-center justify-start gap-2">
        <div className="w-full flex flex-col">
          <label
            htmlFor="answerPicture_search"
            className="py-2 text-lg font-medium"
            onClick={(event) => event.preventDefault()}>
            Name des Bildes
          </label>
          <input
            autoFocus={false}
            className="form-input rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            id="answerPicture_search"
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                loadAnswerPictures(1, searchText, false);
              }
            }}
            onBlur={() => {
              loadAnswerPictures(1, searchText, false);
            }}
            placeholder="Suchen..."
            value={searchText}
          />
        </div>
        <div className="w-full max-h-72 lg:max-h-96 pt-2 overflow-y-auto">
          {loader.loading && (
            <div className="w-full h-72 flex flex-col items-center justify-center space-y-6">
              <BounceLoader color="rgb(126 34 206)" size={70} />
              <p className="text-medium font-medium text-gray-700">Abruf der Bilder</p>
            </div>
          )}
          {loader.error && (
            <div className="w-full h-72 flex flex-col items-center justify-center space-y-6">
              <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
              <p className="text-medium font-medium text-gray-700">
                Abruf der Bilder fehlgeschlagen
              </p>
            </div>
          )}
          {!loader.loading && !loader.error && answerPictures.length === 0 && (
            <div className="w-full h-72 flex flex-col items-center justify-center space-y-6">
              <FontAwesomeIcon
                icon={faFaceFrownOpen}
                size="1x"
                className="text-4xl text-gray-700"
              />
              <p className="text-medium font-medium text-gray-700">Keine Bilder vorhanden</p>
            </div>
          )}
          {!loader.loading && !loader.error && answerPictures.length > 0 && (
            <div className="w-full flex-auto grid auto-rows-min grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-2 p-1">
              {answerPictures.map((answerPicture) => {
                return (
                  <button
                    key={'answerPicture_' + answerPicture._id}
                    disabled={
                      !('picture' in updateAnswerOption) || !updateAnswerOption.picture
                        ? answerPicture.fileName === ''
                        : updateAnswerOption.picture._id == answerPicture._id ||
                          answerPicture.fileName === ''
                    }
                    onClick={() => {
                      setUpdateAnswerOption({ ...updateAnswerOption, picture: answerPicture });
                    }}
                    title={answerPicture.name}
                    className={`w-full h-32 flex items-center justify-center rounded-lg bg-white disabled:cursor-not-allowed ${updateAnswerOption?.picture?._id === answerPicture._id ? 'border-2 border-purple-700' : 'border border-gray-200 hover:ring-1 hover:ring-purple-500'}`}>
                    {answerPicture.fileName && answerPicture.fileName in answerPictureUrls ? (
                      <img
                        className="max-h-32 w-auto p-2"
                        src={
                          answerPictureUrls[answerPicture.fileName] +
                          '?cacheBreak=' +
                          new Date(answerPicture.edited).getTime()
                        }
                        alt="Bild"
                      />
                    ) : (
                      <span className="text-lg font-normal text-red-500">Noch kein Bild</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-2 mt-4">
          <button
            className={`px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
              loader.loading ? 'loading-button' : ''
            }`}
            disabled={loader.loading || pagination.lastPage === pagination.page}
            onClick={() => {
              loadAnswerPictures(pagination.page + 1, searchText, true);
            }}
            title="Mehr Bilder laden">
            Mehr Laden
          </button>
          <button
            className={`px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${
              updating ? 'loading-button' : ''
            }`}
            disabled={updating || answerOption.picture === updateAnswerOption.picture}
            onClick={updatePicture}
            title="Bildauswahl speichern">
            Speichern
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<AnswerOptionPictureModalRefAttributes, AnswerOptionPictureModalProps>(
  AnswerOptionPictureModal
);
