import React, { useEffect, useState } from 'react';
import { Survey } from '../../data/types/survey.types';
import SurveyService from '../../data/services/survey.service';

const Surveys: () => React.JSX.Element = () => {
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
    <div className="w-full h-[500px] p-4 rounded-lg bg-white border border-gray-200">
      <p>Umfragen</p>
      <p>{JSON.stringify(surveys)}</p>
    </div>
  );
};

export default Surveys;
