import React, { useEffect, useState } from 'react';
import { Survey } from '../../data/types/survey.types';
import usePagination from '../../utils/hooks/use.pagination.hook';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';
import PagingBox from '../../components/paging/PagingBox';
import SurveyService from '../../data/services/survey.service';
import useLoading, { LoadingOption } from '../../utils/hooks/use.loading';
import useQueryParams from '../../utils/hooks/use.query.params';

const Surveys: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfragen');
  const [queryParams, setQueryParams] = useQueryParams();

  const loader = useLoading();
  const pagination = usePagination(10);
  const [surveys, setSurveys] = useState<Array<Survey>>([]);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    loader.set(LoadingOption.LOADING);

    SurveyService.getSurveys(pagination.page, pagination.perPage).then((response) => {
      if (response.success) {
        setSurveys(response.data.surveys);
        pagination.update(response.data.paging, response.data.surveys.length);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-1 gap-6">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 py-10 px-10">
        <div>Suche</div>
        <div>Senden</div>
      </div>
      <div className="w-full flex rounded-lg bg-white border border-gray-200 py-10 px-10">
        {JSON.stringify(surveys)}
      </div>
      <div className="w-full flex rounded-lg bg-white border border-gray-200 py-10 px-10">
        {JSON.stringify(loader)}
      </div>
      <PagingBox
        pagination={pagination}
        openPage={(number) => console.log('opening page ' + number)}
      />
    </div>
  );
};

export default Surveys;
