import React, { useEffect, useState } from 'react';
import SurveyService from '../../data/services/survey.service';
import { Survey } from '../../data/types/survey.types';

const Dashboard: () => React.JSX.Element = () => {
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
      <p>{JSON.stringify(surveys)}</p>
    </div>
  );
};

export default Dashboard;
