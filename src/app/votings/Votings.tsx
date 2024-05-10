import React, { Fragment, useEffect, useRef, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Survey } from '../../data/types/survey.types';
import SurveyService from '../../data/services/survey.service';
import useGroupClickOutside from '../../utils/hooks/use.group.click.outside.hook';

const Votings: () => React.JSX.Element = () => {
  useDashboardTitle('Abstimmungen');

  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchCompletionRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  const [surveys, setSurveys] = useState<Array<Survey>>([]);
  const [survey, setSurvey] = useState<Survey>();

  const [displayOptions, setDisplayOptions] = useState<{
    absolute: boolean;
    daySpan: boolean;
    hourSpan: boolean;
  }>({
    absolute: false,
    daySpan: false,
    hourSpan: false
  });

  const loadSurveys: (keyword?: string) => void = (keyword) => {
    SurveyService.getSurveys(1, 10, {
      keyword: keyword || searchText,
      draft: false
    }).then((response) => {
      if (response.success) {
        setSurveys(response.data.surveys);
      } else {
        setSurveys([]);
      }
    });
  };

  useGroupClickOutside([searchBarRef, searchCompletionRef], () => {
    setSearchFocused(false);
  });

  useEffect(() => {
    if (!searchFocused) {
      if (survey && survey.name !== searchText) {
        if (searchText.trim() === '') {
          setSearchText('');
          setSurvey(undefined);
        } else {
          setSearchText(survey.name);
        }
      }
    }
  }, [searchFocused]);

  useEffect(() => {
    loadSurveys();
  }, []);

  return (
    <div className="w-full h-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-auto">
      <div className="w-full flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
        <span className="text-xl font-semibold whitespace-nowrap truncate">Umfrage auswählen</span>
        <div className="w-full flex flex-col items-start justify-center mt-2">
          <div
            className="relative lg:w-1/2 w-full flex flex-col items-start justify-center"
            ref={searchBarRef}>
            <input
              className="form-input w-full pl-11 rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 peer"
              placeholder="Suchen..."
              type="text"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                loadSurveys(event.target.value);
              }}
              onFocus={() => {
                if (!searchFocused) {
                  setSearchFocused(true);
                }
              }}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="1x"
              className="absolute left-4 text-xl text-gray-600 peer-focus:text-purple-800"
            />
            {survey && searchText === survey.name && (
              <button
                className="absolute right-3 p-1 flex flex-row items-center justify-center group"
                onClick={() => {
                  setSearchText('');
                  setSurvey(undefined);
                  loadSurveys(''); // otherwise it would use search-text of old state

                  if (searchFocused) {
                    setSearchFocused(false);
                  }
                }}
                type="button">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  size="1x"
                  className="text-xl text-gray-600 group-hover:text-red-500"
                />
              </button>
            )}
          </div>
          <div className="relative lg:w-1/2 w-full" ref={searchCompletionRef}>
            {searchFocused && (
              <div className="absolute top-0.5 left-0 w-full">
                <ul className="w-full max-h-36 rounded-md bg-white border border-gray-200 overflow-y-scroll">
                  {surveys.length === 0 ? (
                    <li className="px-4 py-2 font-normal text-base text-gray-600">
                      Keine Ergebnisse
                    </li>
                  ) : (
                    surveys.map((survey, index) => {
                      return (
                        <Fragment key={'survey_' + survey._id}>
                          <li
                            className="px-4 py-2 font-normal text-base text-black hover:text-purple-700 whitespace-nowrap truncate cursor-pointer"
                            onClick={() => {
                              setSearchFocused(false);
                              setSearchText(survey.name);
                              setSurvey(survey);
                            }}
                            key={'survey_' + survey._id}>
                            {survey.name}
                          </li>
                          {index !== surveys.length - 1 && <hr />}
                        </Fragment>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
        <span className="text-xl font-semibold whitespace-nowrap truncate">Darstellung(-en)</span>
        <div className="w-full flex flex-row flex-wrap justify-start items-center gap-x-4">
          <div className="flex flex-row items-center justify-start gap-2">
            <input
              type="checkbox"
              checked={displayOptions.absolute}
              readOnly
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, absolute: !prev.absolute }));
              }}
              className={`form-checkbox pr-2 rounded-md border-gray-300 checked:accent-purple-800 checked:bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                displayOptions.absolute ? '!bg-purple-800 !accent-purple-800' : ''
              }`}
            />
            <p
              className="font-normal text-lg cursor-pointer whitespace-nowrap"
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, absolute: !prev.absolute }));
              }}>
              absolut
            </p>
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <input
              type="checkbox"
              checked={displayOptions.daySpan}
              readOnly
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, daySpan: !prev.daySpan }));
              }}
              className={`form-checkbox pr-2 rounded-md border-gray-300 checked:accent-purple-800 checked:bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                displayOptions.daySpan ? '!bg-purple-800 !accent-purple-800' : ''
              }`}
            />
            <p
              className="font-normal text-lg cursor-pointer whitespace-nowrap"
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, daySpan: !prev.daySpan }));
              }}>
              Zeitraum (Tage)
            </p>
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <input
              type="checkbox"
              checked={displayOptions.hourSpan}
              readOnly
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, hourSpan: !prev.hourSpan }));
              }}
              className={`form-checkbox pr-2 rounded-md border-gray-300 checked:accent-purple-800 checked:bg-purple-800 focus:ring-1 focus:ring-purple-800 ${
                displayOptions.hourSpan ? '!bg-purple-800 !accent-purple-800' : ''
              }`}
            />
            <p
              className="font-normal text-lg cursor-pointer whitespace-nowrap"
              onClick={() => {
                setDisplayOptions((prev) => ({ ...prev, hourSpan: !prev.hourSpan }));
              }}>
              Zeitraum (Stunden)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Votings;
