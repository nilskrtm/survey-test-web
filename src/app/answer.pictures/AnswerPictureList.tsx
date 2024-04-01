import React, { createRef, useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import useQueryParams, { QuerySearchParams } from '../../utils/hooks/use.query.params.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import usePagination from '../../utils/hooks/use.pagination.hook';
import { AnswerPicture, AnswerPictureUrls } from '../../data/types/answer.picture.types';
import { parseQuerySearchParams } from '../../utils/query/query.params.util';
import AnswerPictureService from '../../data/services/answer.picture.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlus,
  faClockRotateLeft,
  faExclamation,
  faFaceFrownOpen,
  faMagnifyingGlass,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { BounceLoader } from 'react-spinners';
import moment from 'moment/moment';
import { NavLink } from 'react-router-dom';
import PagingBox from '../../components/paging/PagingBox';
import CreateAnswerPictureModal, {
  CreateAnswerPictureModalRefAttributes
} from '../../components/answer.pictures/CreateAnswerPictureModal';
import createAnswerPictureModal from '../../components/answer.pictures/CreateAnswerPictureModal';

interface AnswerPictureListQueryParams extends QuerySearchParams {
  page: number;
  keyword: string;
  sortingType: string;
  sortingOption: string;
}

const AnswerPictureList: () => React.JSX.Element = () => {
  useDashboardTitle('Meine Bilder');

  const [queryParams, setQueryParams] = useQueryParams({ page: 1, search: '' });

  const [searchText, setSearchText] = useState<string>('');
  const [sortingType, setSortingType] = useState<string>('');
  const [sortingOption, setSortingOption] = useState<string>('');

  const loader = useLoader();
  const pagination = usePagination(10);
  const [answerPictures, setAnswerPictures] = useState<Array<AnswerPicture>>([]);
  const [answerPictureUrls, setAnswerPictureUrls] = useState<AnswerPictureUrls>({});

  const createAnswerPictureModalRef = createRef<CreateAnswerPictureModalRefAttributes>();

  useEffect(() => {
    const { page, keyword, sortingOption, sortingType } =
      parseQuerySearchParams<AnswerPictureListQueryParams>(queryParams);

    setSearchText(keyword);
    setSortingOption(sortingOption);
    setSortingType(sortingType);
    loadAnswerPictures(page, keyword, sortingOption, sortingType);
  }, [queryParams]);

  const loadAnswerPictures = (
    requestedPage: number,
    search: string,
    searchSortingOption: string,
    searchSortingType: string
  ) => {
    loader.set(LoadingOption.LOADING);

    AnswerPictureService.getAnswerPictures(requestedPage, pagination.perPage, {
      keyword: search,
      sortingOption: searchSortingOption,
      sortingType: searchSortingType
    }).then((response) => {
      if (response.success) {
        AnswerPictureService.getAnswerPictureUrls(
          response.data.answerPictures
            .filter((answerPicture) => 'fileName' in answerPicture && answerPicture.fileName)
            .map((answerPicture) => answerPicture.fileName)
        ).then((answerPictureUrlsResponse) => {
          if (answerPictureUrlsResponse.success) {
            setAnswerPictures(response.data.answerPictures);
            setAnswerPictureUrls(answerPictureUrlsResponse.data.urls);
            pagination.update(response.data.paging, response.data.answerPictures.length);
            loader.set(LoadingOption.RESET);
          } else {
            loader.set(LoadingOption.ERROR);
          }
        });
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  const updateQuery: (param: keyof AnswerPictureListQueryParams, value: string | number) => void = (
    param,
    value
  ) => {
    if (value != undefined) {
      setQueryParams((prev) => {
        return { ...prev, [param]: value };
      });
    }
  };

  const createAnswerPicture: () => void = () => {
    createAnswerPictureModalRef.current?.open();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between space-y-8 p-6 overflow-y-scroll">
        <div className="w-full flex flex-row items-center rounded-lg bg-white border border-gray-200 py-4 px-6">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4">
              <div className="w-full lg:w-1/2 flex flex-row items-center justify-start">
                <div className="relative w-full flex flex-row items-center justify-start">
                  <input
                    className="form-input w-full pl-11 rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 peer"
                    placeholder="Suchen..."
                    value={searchText || ''}
                    onChange={(event) => setSearchText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        updateQuery('keyword', searchText);
                      }
                    }}
                    onBlur={() => updateQuery('keyword', searchText)}
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
                  disabled={sortingOption === ''}
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
            <div className="w-full flex flex-row items-center justify-end">
              <button
                onClick={createAnswerPicture}
                className="max-lg:w-full flex items-center justify-center space-x-1 px-3 py-[9px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Neues Bild erstellen">
                <FontAwesomeIcon
                  icon={faPlus}
                  size="1x"
                  fixedWidth
                  className="text-white text-lg"
                />
                <span>Neues Bild</span>
              </button>
            </div>
          </div>
        </div>
        {loader.loading && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <BounceLoader color="rgb(126 34 206)" size={70} />
            <p className="text-medium font-medium text-gray-700">Abruf der Bilder</p>
          </div>
        )}
        {loader.error && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
            <p className="text-medium font-medium text-gray-700">Abruf der Bilder fehlgeschlagen</p>
          </div>
        )}
        {!loader.loading && !loader.error && answerPictures.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faFaceFrownOpen} size="1x" className="text-4xl text-gray-700" />
            <p className="text-medium font-medium text-gray-700">Keine Bilder vorhanden</p>
          </div>
        )}
        {!loader.loading && !loader.error && answerPictures.length > 0 && (
          <div className="w-full flex-auto grid auto-rows-min grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4">
            {answerPictures.map((answerPicture) => {
              const editedDateString =
                moment(answerPicture.edited).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr';
              const createdDateString =
                moment(answerPicture.created).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr';

              return (
                <NavLink
                  className="w-full rounded-lg bg-white border border-gray-200 hover:ring-1 hover:ring-purple-500"
                  key={'survey-card-' + answerPicture._id}
                  to={'/answer-pictures/' + answerPicture._id}>
                  <div className="w-full flex flex-col items-center justify-start py-2 px-6">
                    <span
                      className="w-full font-semibold text-xl text-black whitespace-break-spaces truncate"
                      title={answerPicture.name}>
                      {answerPicture.name}
                    </span>
                  </div>
                  <hr className="w-full h-[1px] bg-gray-200" />
                  <div className="w-full h-36 flex flex-row items-center justify-center">
                    {answerPicture.fileName && answerPicture.fileName in answerPictureUrls ? (
                      <img
                        className="max-h-36 w-auto p-4"
                        src={
                          answerPictureUrls[answerPicture.fileName] +
                          '?cacheBreak=' +
                          new Date(answerPicture.edited).getTime()
                        }
                        alt="Bild"
                      />
                    ) : (
                      <span className="text-lg font-normal text-red-500">Noch kein Bild</span>
                    )}
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

      {/* create answer-picture modal */}
      <CreateAnswerPictureModal ref={createAnswerPictureModalRef} />
    </>
  );
};

export default AnswerPictureList;
