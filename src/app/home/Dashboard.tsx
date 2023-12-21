import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import SurveyService from '../../data/services/survey.service';
import { Survey } from '../../data/types/survey.types';
import { selectUsername } from '../../store/features/user.slice';

const Dashboard: () => React.JSX.Element = () => {
  const username = useAppSelector(selectUsername);
  const [surveys, setSurveys] = useState<Array<Survey>>([]);

  useEffect(() => {
    SurveyService.getSurveys().then((response) => {
      if (response.success) {
        setSurveys(response.data?.surveys as Array<Survey>);
      } else {
        alert('error');
      }
    });
  }, []);

  return (
    <div className="w-full container">
      <p>Hallo {username}</p>
      <p>{JSON.stringify(surveys)}</p>
    </div>
  );
};

export default Dashboard;
