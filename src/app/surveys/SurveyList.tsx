import React, { useEffect, useState } from 'react';
import { Survey } from '../../data/types/survey.types';
import usePagination from '../../utils/hooks/use.pagination.hook';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title';
import PagingBox from '../../components/paging/PagingBox';
import SurveyService from '../../data/services/survey.service';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader';
import useQueryParams, { QuerySearchParams } from '../../utils/hooks/use.query.params';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamation,
  faFaceFrownOpen,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { parseQuerySearchParams } from '../../utils/query/query.params.util';

interface SurveyListQueryParams extends QuerySearchParams {
  page: number;
  search: string;
}

const SurveyList: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfragen');

  const [queryParams, setQueryParams] = useQueryParams({ page: 1, search: '' });

  const [searchText, setSearchText] = useState<string>('');

  const loader = useLoader();
  const pagination = usePagination(10);
  const [surveys, setSurveys] = useState<Array<Survey>>([]);

  useEffect(() => {
    const { page, search } = parseQuerySearchParams<SurveyListQueryParams>(queryParams);

    setSearchText(search);
    loadSurveys(page);
  }, [queryParams]);

  const loadSurveys = (requestedPage: number) => {
    loader.set(LoadingOption.LOADING);

    SurveyService.getSurveys(requestedPage, pagination.perPage).then((response) => {
      if (response.success) {
        setSurveys(response.data.surveys);
        pagination.update(response.data.paging, response.data.surveys.length);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  const updateQuery: (param: keyof SurveyListQueryParams, value: string | number) => void = (
    param,
    value
  ) => {
    setQueryParams((prev) => {
      return { ...prev, [param]: value };
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between space-y-8 p-6 overflow-y-scroll">
      <div className="w-full flex flex-row items-center justify-between rounded-lg bg-white border border-gray-200 py-4 px-10">
        <div className="relative w-1/3 flex flex-row items-center justify-start">
          <input
            className="w-full h-11 font-normal text-lg text-black placeholder-shown:text-gray-600 pl-14 pr-6 border-b-[1.5px] border-gray-600 focus:outline-none peer"
            placeholder="Suchen..."
            value={searchText || ''}
            onChange={(event) => setSearchText((event.target as HTMLInputElement).value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateQuery('search', searchText);
              }
            }}
            onBlur={() => updateQuery('search', searchText)}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="1x"
            className="absolute left-5 text-xl text-gray-600 peer-focus:text-purple-800"
          />
        </div>
      </div>
      {loader.loading && (
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg p-2">
          <BounceLoader color="rgb(126 34 206)" size={70} />
          <p className="text-medium font-medium text-gray-700">Abruf der Umfragen</p>
        </div>
      )}
      {loader.error && (
        <div className="flex flex-col items-center justify-center space-y-6 p-2">
          <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
          <p className="text-medium font-medium text-gray-700">Abruf der Umfragen fehlgeschlagen</p>
        </div>
      )}
      {!loader.loading && !loader.error && surveys.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-6 p-2">
          <FontAwesomeIcon icon={faFaceFrownOpen} size="1x" className="text-4xl text-gray-700" />
          <p className="text-medium font-medium text-gray-700">Keine Umfragen vorhanden</p>
        </div>
      )}
      {!loader.loading && !loader.error && surveys.length > 0 && (
        <div className="w-full flex-auto grid grid-cols-2 gap-x-12 gap-y-4">
          {surveys.map((survey: Survey) => {
            return (
              <NavLink
                className="w-full h-40 rounded-lg bg-white border border-gray-200 hover:ring-1 hover:ring-purple-500"
                key={'survey-card-' + survey._id}
                to={'/surveys/' + survey._id}>
                <div className="w-full flex flex-col items-start justify-center py-6 px-10">
                  <span className="w-full font-semibold text-xl text-black">{survey.name}</span>
                  <span className="w-full font-semibold text-md text-gray-600">
                    {survey.description}
                  </span>
                </div>
                <hr className="w-full h-[1px] bg-gray-200" />
                <div className="w-full py-6 px-10"></div>
              </NavLink>
            );
          })}
        </div>
      )}
      <PagingBox pagination={pagination} openPage={(number) => updateQuery('page', number)} />
    </div>
  );
};

export default SurveyList;
