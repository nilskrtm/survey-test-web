import React, { useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { useNavigate, useParams } from 'react-router-dom';
import useToasts from '../../utils/hooks/use.toasts.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import { AnswerPicture } from '../../data/types/answer.picture.types';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { dummyAnswerPicture } from '../../utils/surveys/surveys.util';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

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
        setAnswerPicture(response.data.answerPicture);
        setUpdatedAnswerPicture(response.data.answerPicture);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);

        if (response.error?.status === 404) {
          navigate(-1);
        }
      }
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

  return <div></div>;
};

export default AnswerPictureOverview;
