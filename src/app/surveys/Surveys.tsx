import React, { useEffect, useState } from 'react';
import { Survey } from '../../data/types/survey.types';
import SurveyService from '../../data/services/survey.service';
import usePagination from '../../utils/hooks/use.pagination.hook';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';

const Surveys: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfragen');

  const [surveys, setSurveys] = useState<Array<Survey>>([]);
  const pagination = usePagination();

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
    <div className="w-full grid grid-cols-1 gap-12">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 py-10 px-10">
        <p>Umfragen</p>
        <p>{JSON.stringify(surveys)}</p>
      </div>
    </div>
  );
};

export default Surveys;
