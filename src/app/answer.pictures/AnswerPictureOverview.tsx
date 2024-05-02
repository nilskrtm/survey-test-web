import React, { createRef, useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { useNavigate, useParams } from 'react-router-dom';
import useToasts from '../../utils/hooks/use.toasts.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import {
  AnswerPicture,
  AnswerPictureFile,
  UpdateAnswerPictureValues
} from '../../data/types/answer.picture.types';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { dummyAnswerPicture } from '../../utils/surveys/surveys.util';
import { BarLoader, BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { hasChanged } from '../../utils/data/update.util';
import { APIError } from '../../data/types/common.types';
import DeleteAnswerPictureModal, {
  DeleteAnswerPictureModalRefAttributes
} from 'components/answer.pictures/DeleteAnswerPictureModal';
import ContentEditable from '../../components/layout/editable.content/ContentEditable';

interface AnswerPictureOverviewPathParams extends Record<string, string> {
  answerPictureId: string;
}

const AnswerPictureOverview: () => React.JSX.Element = () => {
  const setDashboardTitle = useDashboardTitle('Mein Bild');
  const navigate = useNavigate();
  const toaster = useToasts();

  const { answerPictureId } = useParams<AnswerPictureOverviewPathParams>();
  const loader = useLoader();
  const [answerPicture, setAnswerPicture] = useState<AnswerPicture>();
  const [isUsed, setIsUsed] = useState<boolean>(true);

  const deleteAnswerPictureModalRef = createRef<DeleteAnswerPictureModalRefAttributes>();

  const [updating, setUpdating] = useState(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedAnswerPicture, setUpdatedAnswerPicture] =
    useState<AnswerPicture>(dummyAnswerPicture());

  const answerPictureNameRef = createRef<HTMLSpanElement>();
  const fileInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    loadAnswerPicture();
  }, [answerPictureId]);

  useEffect(() => {
    if (answerPicture?.name) {
      setDashboardTitle('Mein Bild: ' + answerPicture.name);
    } else {
      setDashboardTitle('Mein Bild');
    }
  }, [answerPicture]);

  const loadAnswerPicture = () => {
    if (!answerPictureId) return;

    loader.set(LoadingOption.LOADING);

    AnswerPictureService.getAnswerPicture(answerPictureId).then((response) => {
      if (response.success) {
        AnswerPictureService.getAnswerPictureStatus(answerPictureId).then(
          (answerPictureStatusResponse) => {
            if (answerPictureStatusResponse.success) {
              setAnswerPicture(response.data.answerPicture);
              setUpdatedAnswerPicture(response.data.answerPicture);
              setIsUsed(answerPictureStatusResponse.data.used);
              loader.set(LoadingOption.RESET);
            } else {
              loader.set(LoadingOption.ERROR);
            }
          }
        );
      } else {
        loader.set(LoadingOption.ERROR);

        if (response.error?.status === 404) {
          navigate(-1);
        }
      }
    });
  };

  const updateAnswerPictureInternal: (values: Partial<AnswerPicture>) => void = (values) => {
    if (!updatedAnswerPicture) return;

    setUpdatedAnswerPicture({
      ...updatedAnswerPicture,
      ...values
    });
  };

  const updateAnswerPicture: (values: Partial<AnswerPicture & AnswerPictureFile>) => void = (
    values
  ) => {
    if (!answerPicture || isUsed || !hasChanged(answerPicture, values)) return;

    setUpdating(true);
    setUpdatingValues(Object.keys(values));

    AnswerPictureService.updateAnswerPicture(answerPicture._id, values as UpdateAnswerPictureValues)
      .then((response) => {
        if (response.success) {
          setAnswerPicture({ ...answerPicture, ...values });
          setUpdatedAnswerPicture({ ...answerPicture, ...values });
        } else {
          setUpdatedAnswerPicture(answerPicture);

          const error = response.error as APIError;

          if (error.hasFieldErrors) {
            const errorMessages: string[] = [];

            for (const key of Object.keys(error.fieldErrors)) {
              errorMessages.push(error.fieldErrors[key]);
            }

            toaster.sendToast('error', errorMessages);
          } else {
            toaster.sendToast(
              'error',
              error.errorMessage ||
                'Ein unbekannter Fehler ist beim Bearbeiten des Bildes aufgetreten.'
            );
          }
        }
      })
      .finally(() => {
        setUpdating(false);
        setUpdatingValues([]);
      });
  };

  const deleteAnswerPicture: () => void = () => {
    if (deleteAnswerPictureModalRef.current) {
      deleteAnswerPictureModalRef.current.open();
    }
  };

  if (loader.loading || loader.error) {
    if (loader.loading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
          <BounceLoader color="rgb(126 34 206)" size={70} />
          <p className="text-medium font-medium text-gray-700">Laden des Bildes</p>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
          <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
          <p className="text-medium font-medium text-gray-700">Laden des Bildes fehlgeschlagen</p>
        </div>
      );
    }
  }

  return (
    <>
      <div className="w-full h-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-scroll">
        <div className="w-full flex flex-col items-start justify-center rounded-lg gap-2 bg-white border border-gray-200 p-6">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="-[calc(100%-56px)]">
              <div className="w-full inline-block">
                <ContentEditable
                  className={`max-w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-none text-2xl font-semibold whitespace-pre-wrap truncate overflow-hidden after:px-2 ${
                    !loader.loading && !isUsed && !updating
                      ? 'hover:ring-gray-200 hover:ring-1'
                      : ''
                  } ${updating && updatingValues.includes('name') ? '!py-0' : ''}`}
                  disabled={loader.loading || isUsed || updating}
                  html={updatedAnswerPicture.name}
                  onBlur={(event) => {
                    updateAnswerPicture({ name: event.target.innerHTML });
                  }}
                  onChange={(event) => {
                    updateAnswerPictureInternal({ name: event.target.value });
                  }}
                  onClick={() => {
                    if (answerPictureNameRef.current != document.activeElement) {
                      answerPictureNameRef.current?.focus();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      answerPictureNameRef.current?.blur();
                    }
                  }}
                  maxLength={50}
                  preventLinebreak={true}
                  preventPaste={true}
                  innerRef={answerPictureNameRef}
                  tagName="span"
                />
                <BarLoader
                  color="rgb(126 34 206)"
                  cssOverride={{ width: '100%' }}
                  height={1}
                  loading={updating && updatingValues.includes('name')}
                />
              </div>
            </div>
            <div className="h-full w-20 flex flex-col items-center justify-start gap-1 pl-2">
              {isUsed && (
                <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-green-400">
                  <span className="text-xs text-white font-semibold no-select">Genutzt</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center rounded-lg gap-2 bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Bild</span>
          <div className="w-full max-h-56 flex flex-row items-center justify-start">
            {answerPicture?.fileName && 'url' in answerPicture ? (
              <img
                className="max-h-56 w-auto p-4"
                alt="Bild"
                src={
                  (answerPicture as unknown as any)?.url + '?cacheBreak=' + new Date().getTime() ||
                  ''
                }
              />
            ) : (
              <span className="text-lg font-normal text-red-500">Noch kein Bild</span>
            )}
          </div>
          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className={`relative px-3 py-[8px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed ${updating ? 'loading-button' : ''}`}
            disabled={loader.loading || updating || isUsed}
            title="Bild ändern">
            <input
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files?.item(0);

                if (file) {
                  const fileSize = file.size;

                  if (fileSize > 10000000) {
                    toaster.sendToast('warning', 'Das Bild ist größer als 10 mb.');

                    return;
                  }

                  updateAnswerPicture({ file: file });
                }
              }}
              id="answerPicture_file"
              type="file"
              accept="image/jpeg,image/png"
              className="absolute top-0 left-0 w-full h-full hidden"
            />
            Bild ändern
          </button>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 rounded-lg bg-white border border-gray-200 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Löschen</span>
          <span className="text-base italic whitespace-break-spaces text-ellipsis">
            Das Bild kann nur gelöscht werden, wenn es derzeit in keiner Umfrage genutzt wird.
          </span>
          <button
            onClick={deleteAnswerPicture}
            className="px-3 py-[8px] rounded-md bg-red-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed"
            disabled={loader.loading || updating}
            title="Löschen des Bildes">
            Löschen
          </button>
        </div>
      </div>

      {/* delete answer-picture modal */}
      {answerPicture && (
        <DeleteAnswerPictureModal answerPicture={answerPicture} ref={deleteAnswerPictureModalRef} />
      )}
    </>
  );
};

export default AnswerPictureOverview;
