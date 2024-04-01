import React, { useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { useNavigate, useParams } from 'react-router-dom';
import useToasts from '../../utils/hooks/use.toasts.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { AnswerPicture, UpdateAnswerPictureValues } from '../../data/types/answer.picture.types';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { dummyAnswerPicture } from '../../utils/surveys/surveys.util';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { hasChanged } from '../../utils/data/update.util';
import { APIError } from '../../data/types/common.types';

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

  const [updating, setUpdating] = useState(false);
  const [updatingValues, setUpdatingValues] = useState<Array<string>>([]);
  const [updatedAnswerPicture, setUpdatedAnswerPicture] =
    useState<AnswerPicture>(dummyAnswerPicture());

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

  const updateAnswerPicture: (values: Partial<AnswerPicture>) => void = (values) => {
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
    <div className="w-full h-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-scroll"></div>
  );
};

export default AnswerPictureOverview;
