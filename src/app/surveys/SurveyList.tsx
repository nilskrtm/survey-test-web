import React, { createRef, useEffect, useState } from 'react';
import { Survey } from '../../data/types/survey.types';
import usePagination from '../../utils/hooks/use.pagination.hook';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import PagingBox from '../../components/paging/PagingBox';
import SurveyService from '../../data/services/survey.service';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import useQueryParams, { QuerySearchParams } from '../../utils/hooks/use.query.params.hook';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlus,
  faClockRotateLeft,
  faExclamation,
  faFaceFrownOpen,
  faMagnifyingGlass,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { parseQuerySearchParams } from '../../utils/query/query.params.util';
import moment from 'moment';
import CreateSurveyModal, {
  CreateSurveyModalRefAttributes
} from '../../components/surveys/CreateSurveyModal';

interface SurveyListQueryParams extends QuerySearchParams {
  page: number;
  keyword: string;
  archived: string;
  active: string;
  draft: string;
  sortingType: string;
  sortingOption: string;
}

type SurveyFilterOptions = {
  keyword: string;
  archived?: boolean;
  active?: boolean;
  draft?: boolean;
};

const SurveyList: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Umfragen');

  const [queryParams, setQueryParams] = useQueryParams({
    page: 1,
    keyword: '',
    archived: '',
    active: '',
    draft: '',
    sortingOption: '',
    sortingType: ''
  });

  const [filterOptions, setFilterOptions] = useState<SurveyFilterOptions>({
    keyword: '',
    archived: undefined,
    active: undefined,
    draft: undefined
  });
  const [sortingType, setSortingType] =
    useState<Pick<SurveyListQueryParams, 'sortingType'>['sortingType']>('');
  const [sortingOption, setSortingOption] =
    useState<Pick<SurveyListQueryParams, 'sortingOption'>['sortingOption']>('');

  const loader = useLoader();
  const pagination = usePagination(10);
  const [surveys, setSurveys] = useState<Array<Survey>>([]);

  const createSurveyModalRef = createRef<CreateSurveyModalRefAttributes>();

  useEffect(() => {
    const { page, keyword, archived, active, draft, sortingOption, sortingType } =
      parseQuerySearchParams<SurveyListQueryParams>(queryParams);
    const newFilterOptions: SurveyFilterOptions = {
      keyword: keyword ? keyword : '',
      archived: archived ? JSON.parse(archived) : undefined,
      active: active ? JSON.parse(active) : undefined,
      draft: draft ? JSON.parse(draft) : undefined
    };

    setFilterOptions(newFilterOptions);
    setSortingOption(sortingOption);
    setSortingType(sortingType);
    loadSurveys(page, newFilterOptions, sortingOption, sortingType);
  }, [queryParams]);

  const loadSurveys = (
    requestedPage: number,
    filterOptions: SurveyFilterOptions,
    searchSortingOption: string,
    searchSortingType: string
  ) => {
    loader.set(LoadingOption.LOADING);

    SurveyService.getSurveys(requestedPage, pagination.perPage, {
      ...filterOptions,
      sortingOption: searchSortingOption,
      sortingType: searchSortingType
    }).then((response) => {
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
    if (value != undefined) {
      setQueryParams((prev) => {
        if (param === 'active' && 'draft' in prev && prev.draft != undefined) {
          return { ...prev, draft: '', [param]: value };
        }

        return { ...prev, [param]: value };
      });
    }
  };

  const surveyActive: (survey: Survey) => boolean = (survey) => {
    if (!survey || survey?.draft) return false;

    const currentDate = new Date();
    const startDate = new Date(survey.startDate);
    const endDate = new Date(survey.endDate);

    return (
      startDate.getTime() <= currentDate.getTime() && currentDate.getTime() < endDate.getTime()
    );
  };

  const createSurvey: () => void = () => {
    createSurveyModalRef.current?.open();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between space-y-8 p-6 overflow-y-auto">
        <div className="w-full flex flex-row items-center rounded-lg bg-white border border-gray-200 py-4 px-6">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4">
              <div className="w-full lg:w-1/2 flex flex-row items-center justify-start">
                <div className="relative w-full flex flex-row items-center justify-start">
                  <input
                    className="form-input w-full pl-11 rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 peer"
                    placeholder="Suchen..."
                    value={filterOptions.keyword}
                    onChange={(event) =>
                      setFilterOptions((prev) => ({ ...prev, keyword: event.target.value }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        updateQuery('keyword', filterOptions.keyword);
                      }
                    }}
                    onBlur={() => updateQuery('keyword', filterOptions.keyword)}
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size="1x"
                    className="absolute left-4 text-xl text-gray-600 peer-focus:text-purple-800"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-row items-center justify-between gap-2">
                <select
                  value={sortingOption}
                  onChange={(event) => {
                    if (event.target.value === '') {
                      setQueryParams((prev) => {
                        return { ...prev, sortingOption: event.target.value, sortingType: '' };
                      });
                    } else {
                      if (sortingType === '') {
                        setQueryParams((prev) => {
                          return {
                            ...prev,
                            sortingOption: event.target.value,
                            sortingType: 'ascending'
                          };
                        });
                      } else {
                        updateQuery('sortingOption', event.target.value);
                      }
                    }
                  }}
                  className="form-select w-1/2 rounded-md font-normal text-base truncate focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500">
                  <option value="">Option wählen</option>
                  <option value="name">Name</option>
                  <option value="edited">Bearbeitungsdatum</option>
                  <option value="created">Erstelldatum</option>
                </select>{' '}
                <select
                  value={sortingType}
                  disabled={!sortingOption}
                  onChange={(event) => {
                    updateQuery('sortingType', event.target.value);
                  }}
                  className="form-select w-1/2 rounded-md font-normal text-base truncate focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500">
                  <option value="">Art wählen</option>
                  {sortingOption === 'name' ? (
                    <>
                      <option value="ascending">A zu Z</option>
                      <option value="descending">Z zu A</option>
                    </>
                  ) : (
                    <>
                      <option value="ascending">zuletzt zum Schluss</option>
                      <option value="descending">zuletzt zuerst</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="w-full flex flex-wrap flex-row items-center justify-between gap-x-2 gap-y-2 lg:gap-y-4">
              <div className="flex flex-row items-center justify-start gap-x-4">
                <div className="flex flex-row items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filterOptions.active === true}
                    readOnly
                    onClick={() => {
                      const current = filterOptions.active;

                      updateQuery('active', current === undefined ? 'true' : '');
                    }}
                    className={`form-checkbox pr-2 rounded-md border-gray-300 checked:!accent-purple-800 checked:!bg-purple-800 focus:ring-1 focus:ring-purple-800`}
                  />
                  <p
                    className="font-normal text-lg cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      const current = filterOptions.active;

                      updateQuery('active', current === undefined ? 'true' : '');
                    }}>
                    Aktiv
                  </p>
                </div>
                <div className="flex flex-row items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filterOptions.draft !== undefined}
                    readOnly
                    onClick={() => {
                      const current = filterOptions.draft;

                      updateQuery(
                        'draft',
                        current === undefined ? 'false' : !current ? 'true' : ''
                      );
                    }}
                    className={`form-checkbox pr-2 rounded-md border-gray-300 checked:!accent-purple-800 checked:!bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                      filterOptions.draft === true ? '!bg-input-crossed' : ''
                    }`}
                  />
                  <p
                    className="font-normal text-lg cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      const current = filterOptions.draft;

                      updateQuery(
                        'draft',
                        current === undefined ? 'false' : !current ? 'true' : ''
                      );
                    }}>
                    Bereit
                  </p>
                </div>
                <div className="flex flex-row items-center justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filterOptions.archived !== undefined}
                    readOnly
                    onClick={() => {
                      const current = filterOptions.archived;

                      updateQuery(
                        'archived',
                        current === undefined ? 'true' : current ? 'false' : ''
                      );
                    }}
                    className={`form-checkbox pr-2 rounded-md border-gray-300 checked:!accent-purple-800 checked:!bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                      filterOptions.archived === false ? '!bg-input-crossed' : ''
                    }`}
                  />
                  <p
                    className="font-normal text-lg cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      const current = filterOptions.archived;

                      updateQuery(
                        'archived',
                        current === undefined ? 'true' : current ? 'false' : ''
                      );
                    }}>
                    Archiviert
                  </p>
                </div>
              </div>
              <button
                onClick={createSurvey}
                className="max-lg:w-full flex items-center justify-center space-x-1 px-3 py-[9px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Neue Umfrage erstellen">
                <FontAwesomeIcon
                  icon={faPlus}
                  size="1x"
                  fixedWidth
                  className="text-white text-lg"
                />
                <span>Neue Umfrage</span>
              </button>
            </div>
          </div>
        </div>
        {loader.loading && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <BounceLoader color="rgb(126 34 206)" size={70} />
            <p className="text-medium font-medium text-gray-700">Abruf der Umfragen</p>
          </div>
        )}
        {loader.error && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
            <p className="text-medium font-medium text-gray-700">
              Abruf der Umfragen fehlgeschlagen
            </p>
          </div>
        )}
        {!loader.loading && !loader.error && surveys.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faFaceFrownOpen} size="1x" className="text-4xl text-gray-700" />
            <p className="text-medium font-medium text-gray-700">Keine Umfragen vorhanden</p>
          </div>
        )}
        {!loader.loading && !loader.error && surveys.length > 0 && (
          <div className="w-full flex-auto grid auto-rows-min grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
            {surveys.map((survey) => {
              const editedDateString =
                moment(survey.edited).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr';
              const createdDateString =
                moment(survey.created).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr';

              return (
                <NavLink
                  className="w-full rounded-lg bg-white border border-gray-200 hover:ring-1 hover:ring-purple-500"
                  key={'survey-card-' + survey._id}
                  to={'/surveys/' + survey._id}>
                  <div className="w-full flex flex-row items-start justify-between py-6 px-6">
                    <div className="w-full flex flex-col items-center justify-start">
                      <span
                        className="w-full font-semibold text-xl text-black whitespace-break-spaces truncate"
                        title={survey.name}>
                        {survey.name}
                      </span>
                      <span className="w-full font-semibold text-md text-gray-600 whitespace-break-spaces truncate">
                        {survey.description}
                      </span>
                    </div>
                    <div className="h-full w-20 flex flex-col items-center justify-start gap-1 pl-2">
                      {survey.draft && (
                        <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-purple-800">
                          <span className="text-xs text-white font-semibold no-select">
                            Entwurf
                          </span>
                        </div>
                      )}
                      {!survey.draft && !surveyActive(survey) && (
                        <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-green-400">
                          <span className="text-xs text-white font-semibold no-select">Bereit</span>
                        </div>
                      )}
                      {!survey.draft && surveyActive(survey) && (
                        <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-green-400">
                          <span className="text-xs text-white font-semibold no-select">Aktiv</span>
                        </div>
                      )}
                      {survey.archived && (
                        <div className="w-16 h-6 flex flex-row items-center justify-center rounded-lg bg-orange-400">
                          <span className="text-xs text-white font-semibold no-select">Archiv</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="w-full h-[1px] bg-gray-200" />
                  <div className="w-full flex flex-row items-center justify-center gap-2 py-2 px-8">
                    <div
                      className="w-1/2 flex flex-row items-center justify-center gap-1"
                      title="Zuletzt bearbeitet am">
                      <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        size="1x"
                        className="text-base text-gray-700"
                      />
                      <span className="whitespace-nowrap truncate" title={editedDateString}>
                        {editedDateString}
                      </span>
                    </div>
                    <div
                      className="w-1/2 flex flex-row items-center justify-center gap-1"
                      title="Erstellt am">
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        size="1x"
                        className="text-base text-gray-700"
                      />
                      <span className="whitespace-nowrap truncate" title={createdDateString}>
                        {createdDateString}
                      </span>
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
        <PagingBox pagination={pagination} openPage={(number) => updateQuery('page', number)} />
      </div>

      {/* create survey modal */}
      <CreateSurveyModal ref={createSurveyModalRef} />
    </>
  );
};

export default SurveyList;
