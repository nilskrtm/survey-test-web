import React, { createRef, Fragment, useEffect, useRef, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Survey } from '../../data/types/survey.types';
import SurveyService from '../../data/services/survey.service';
import useGroupClickOutside from '../../utils/hooks/use.group.click.outside.hook';
import DatePicker from '../../components/layout/time/DatePicker';
import moment from 'moment';
import TimePicker from '../../components/layout/time/TimePicker';
import VotingService from '../../data/services/voting.service';
import VotingsQuestionCard from '../../components/votings/VotingsQuestionCard';
import { getUserTimezone } from '../../utils/time/time.util';
import { DayVotings, HourVotings } from '../../data/types/voting.types';
import useToasts from '../../utils/hooks/use.toasts.hook';
import { AbsoluteVotingsChartData } from '../../components/votings/charts/AbsoluteVotingsChart';
import { HourSpanVotingsChartData } from '../../components/votings/charts/HourSpanVotingsChart';
import { DaySpanVotingsChartData } from '../../components/votings/charts/DaySpanVotingsChart';

const Votings: () => React.JSX.Element = () => {
  useDashboardTitle('Auswertung');

  const toaster = useToasts();

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

  const daySpanStartDateRef = createRef<HTMLSpanElement>();
  const daySpanEndDateRef = createRef<HTMLSpanElement>();
  const daySpanStartDatePickerRef = createRef<HTMLDivElement>();
  const daySpanEndDatePickerRef = createRef<HTMLDivElement>();

  const [editingDaySpanDate, setEditingDaySpanDate] = useState<'startDate' | 'endDate'>();
  const [daySpanDates, setDaySpanDates] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString()
  });

  const hourSpanDayDateRef = createRef<HTMLSpanElement>();
  const hourSpanStartDateRef = createRef<HTMLSpanElement>();
  const hourSpanEndDateRef = createRef<HTMLSpanElement>();
  const hourSpanDayDatePickerRef = createRef<HTMLDivElement>();
  const hourSpanStartDatePickerRef = createRef<HTMLDivElement>();
  const hourSpanEndDatePickerRef = createRef<HTMLDivElement>();

  const [editingHourSpanDate, setEditingHourSpanDate] = useState<
    'dayDate' | 'startDate' | 'endDate'
  >();
  const [hourSpanDates, setHourSpanDates] = useState<{
    dayDate: string;
    startDate: string;
    endDate: string;
  }>({
    dayDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString()
  });

  const [absoluteVotings, setAbsoluteVotings] = useState<AbsoluteVotingsChartData>({
    loading: false,
    error: false,
    votesByAnswerOption: {}
  });
  const [daySpanVotings, setDaySpanVotings] = useState<DaySpanVotingsChartData>({
    loading: false,
    error: false,
    votesByAnswerOption: {},
    days: []
  });

  const [hourSpanVotings, setHourSpanVotings] = useState<HourSpanVotingsChartData>({
    loading: false,
    error: false,
    votesByAnswerOption: {},
    hours: []
  });

  const loadSurveys: (keyword?: string) => void = (keyword) => {
    SurveyService.getSurveys(1, 10, {
      keyword: keyword || searchText,
      draft: false
    }).then((response) => {
      if (response.success) {
        setSurveys(response.data.surveys);
      } else {
        toaster.sendToast('error', 'Fehler beim Abrufen der Umfragen.');

        setSurveys([]);
      }
    });
  };

  const loadAbsoluteVotings: () => void = () => {
    if (!survey) return;

    setAbsoluteVotings({ loading: true, error: false, votesByAnswerOption: {} });

    VotingService.getVotingsAbsoluteOfSurvey(survey._id).then((response) => {
      if (response.success) {
        const votesByAnswerOption: {
          [answerOptionId: string]: number;
        } = {};

        survey.questions.forEach((question) => {
          question.answerOptions.forEach((answerOption) => {
            const votes = response.data.votes.find(
              (absoluteVotings) =>
                absoluteVotings.questionId === question._id &&
                absoluteVotings.answerOptionId === answerOption._id
            );

            votesByAnswerOption[answerOption._id] = votes ? votes.votes : 0;
          });
        });

        setAbsoluteVotings({
          loading: false,
          error: false,
          votesByAnswerOption: votesByAnswerOption
        });
      } else {
        setAbsoluteVotings({ loading: false, error: true, votesByAnswerOption: {} });
      }
    });
  };

  const loadDaySpanVotings: () => void = () => {
    if (!survey) return;

    setDaySpanVotings({ loading: true, error: false, votesByAnswerOption: {}, days: [] });

    VotingService.getVotingsDaySpanOfSurvey(
      survey._id,
      getUserTimezone(),
      daySpanDates.startDate,
      daySpanDates.endDate
    ).then((response) => {
      if (response.success) {
        const votes = response.data.votes;
        const days = response.data.days;
        const votesByAnswerOption: {
          [answerOptionId: string]: Array<DayVotings>;
        } = {};

        survey.questions.forEach((question) => {
          question.answerOptions.forEach((answerOption) => {
            votesByAnswerOption[answerOption._id] = [
              ...votes.filter((vote) => vote.answerOptionId === answerOption._id)
            ];
          });
        });

        setDaySpanVotings({
          loading: false,
          error: false,
          votesByAnswerOption: votesByAnswerOption,
          days: days
        });
      } else {
        setDaySpanVotings({ loading: false, error: true, votesByAnswerOption: {}, days: [] });
      }
    });
  };

  const loadHourSpanVotings: () => void = () => {
    if (!survey) return;

    setHourSpanVotings({ loading: true, error: false, votesByAnswerOption: {}, hours: [] });

    VotingService.getVotingsHourSpanOfSurvey(
      survey._id,
      getUserTimezone(),
      hourSpanDates.dayDate,
      hourSpanDates.startDate,
      hourSpanDates.endDate
    ).then((response) => {
      if (response.success) {
        const votes = response.data.votes;
        const hours = response.data.hours;
        const votesByAnswerOption: {
          [answerOptionId: string]: Array<HourVotings>;
        } = {};

        survey.questions.forEach((question) => {
          question.answerOptions.forEach((answerOption) => {
            votesByAnswerOption[answerOption._id] = [
              ...votes.filter((vote) => vote.answerOptionId === answerOption._id)
            ];
          });
        });

        setHourSpanVotings({
          loading: false,
          error: false,
          votesByAnswerOption: votesByAnswerOption,
          hours: hours
        });
      } else {
        setHourSpanVotings({ loading: false, error: true, votesByAnswerOption: {}, hours: [] });
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

  useEffect(() => {
    if (displayOptions.absolute) {
      loadAbsoluteVotings();
    }
  }, [displayOptions.absolute]);

  useEffect(() => {
    if (displayOptions.daySpan) {
      loadDaySpanVotings();
    }
  }, [displayOptions.daySpan]);

  useEffect(() => {
    if (displayOptions.hourSpan) {
      loadHourSpanVotings();
    }
  }, [displayOptions.hourSpan]);

  useGroupClickOutside(
    [daySpanStartDateRef, daySpanEndDateRef, daySpanStartDatePickerRef, daySpanEndDatePickerRef],
    () => {
      if (editingDaySpanDate !== undefined) {
        setEditingDaySpanDate(undefined);
        loadDaySpanVotings();
      }
    }
  );

  useGroupClickOutside(
    [
      hourSpanDayDateRef,
      hourSpanStartDateRef,
      hourSpanEndDateRef,
      hourSpanDayDatePickerRef,
      hourSpanStartDatePickerRef,
      hourSpanEndDatePickerRef
    ],
    () => {
      if (editingHourSpanDate !== undefined) {
        setEditingHourSpanDate(undefined);
        loadHourSpanVotings();
      }
    }
  );

  useEffect(() => {
    if (survey) {
      setDisplayOptions({ absolute: false, daySpan: false, hourSpan: false });
      setDaySpanDates({ startDate: survey.startDate, endDate: survey.startDate });
      setHourSpanDates({
        dayDate: survey.startDate,
        startDate: new Date(0, 0, 0, 0, 0, 0).toISOString(),
        endDate: new Date(0, 0, 0, 23, 59, 59, 999).toISOString()
      });
    }
  }, [survey]);

  return (
    <div className="w-full h-full grid auto-rows-min grid-cols-1 gap-4 p-6 overflow-y-auto">
      <div className="w-[calc(100%-40px)] flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
        <span className="text-xl font-semibold whitespace-nowrap truncate">Umfrage</span>
        <div className="w-full flex flex-col items-start justify-center">
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
                <ul className="w-full max-h-36 rounded-md bg-white border border-gray-200 overflow-y-auto">
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
                              if (searchText !== survey.name) {
                                setSearchFocused(false);
                                setSearchText(survey.name);
                                setSurvey(survey);
                              }
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
          {survey && (
            <span className="text-lg text-black font-normal whitespace-break-spaces mt-2">
              <span className="font-semibold">Von: </span>
              {moment(survey.startDate).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr'}
              <span className="font-semibold ml-4">Bis: </span>
              {moment(survey.endDate).format('DD.MM.YYYY HH:mm') + '\u00A0Uhr'}
            </span>
          )}
        </div>
      </div>

      {survey && (
        <div className="w-[calc(100%-40px)] flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
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
                Gesamt
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
      )}

      {survey && displayOptions.daySpan && (
        <div className="w-[calc(100%-40px)] flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Zeitraum (Tage)</span>
          <div className="w-full flex flex-col lg:flex-row gap-x-2">
            <div className="w-full lg:w-fit flex flex-row items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Von:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (editingDaySpanDate !== 'startDate') {
                      setEditingDaySpanDate('startDate');
                    }
                  }}
                  ref={daySpanStartDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingDaySpanDate === 'startDate' ? '!ring-2 !ring-black' : ''
                  }`}>
                  {moment(daySpanDates.startDate).format('DD.MM.YYYY')}
                </span>
                {editingDaySpanDate === 'startDate' && (
                  <DatePicker
                    className="absolute z-10 top-8"
                    ref={daySpanStartDatePickerRef}
                    value={new Date(daySpanDates.startDate)}
                    minDate={survey ? new Date(survey.startDate) : new Date()}
                    maxDate={new Date(daySpanDates.endDate)}
                    onChange={(date) => {
                      setDaySpanDates((prev) => ({ ...prev, startDate: date.toISOString() }));
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:w-fit flex flex-crow items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Bis:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (editingDaySpanDate !== 'endDate') {
                      setEditingDaySpanDate('endDate');
                    }
                  }}
                  ref={daySpanEndDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingDaySpanDate === 'endDate' ? '!ring-2 !ring-black' : ''
                  }`}>
                  {moment(daySpanDates.endDate).format('DD.MM.YYYY')}
                </span>
                {editingDaySpanDate === 'endDate' && (
                  <DatePicker
                    className="absolute z-10 top-8"
                    ref={daySpanEndDatePickerRef}
                    value={new Date(daySpanDates.endDate)}
                    minDate={new Date(daySpanDates.startDate)}
                    maxDate={survey ? new Date(survey.endDate) : new Date()}
                    onChange={(date) => {
                      setDaySpanDates((prev) => ({ ...prev, endDate: date.toISOString() }));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {survey && displayOptions.hourSpan && (
        <div className="w-[calc(100%-40px)] flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">
            Zeitraum (Stunden)
          </span>
          <div className="w-full flex flex-col lg:flex-row lg:flex-wrap gap-x-2">
            <div className="w-full lg:w-fit flex flex-row items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Tag:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (editingHourSpanDate !== 'dayDate') {
                      setEditingHourSpanDate('dayDate');
                    }
                  }}
                  ref={hourSpanDayDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingHourSpanDate === 'dayDate' ? '!ring-2 !ring-black' : ''
                  }`}>
                  {moment(hourSpanDates.dayDate).format('DD.MM.YYYY')}
                </span>
                {editingHourSpanDate === 'dayDate' && (
                  <DatePicker
                    className="absolute z-10 top-8"
                    value={new Date(hourSpanDates.dayDate)}
                    ref={hourSpanDayDatePickerRef}
                    minDate={new Date(survey.startDate)}
                    maxDate={new Date(survey.endDate)}
                    onChange={(date) => {
                      setHourSpanDates((prev) => ({ ...prev, dayDate: date.toISOString() }));
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:w-fit flex flex-row items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Von:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (editingHourSpanDate !== 'startDate') {
                      setEditingHourSpanDate('startDate');
                    }
                  }}
                  ref={hourSpanStartDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingHourSpanDate === 'startDate' ? '!ring-2 !ring-black' : ''
                  }`}>
                  {moment(hourSpanDates.startDate).format('HH:mm') + '\u00A0Uhr'}
                </span>
                {editingHourSpanDate === 'startDate' && (
                  <TimePicker
                    className="absolute z-10 top-8"
                    value={new Date(hourSpanDates.startDate)}
                    ref={hourSpanStartDatePickerRef}
                    minDate={new Date(survey.startDate)}
                    maxDate={new Date(hourSpanDates.endDate)}
                    onChange={(date) => {
                      setHourSpanDates((prev) => ({
                        ...prev,
                        startDate: date.toISOString()
                      }));
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:w-fit flex flex-row items-center justify-start">
              <span className="text-lg font-semibold whitespace-nowrap truncate">Bis:&nbsp;</span>
              <div className="relative flex flex-col">
                <span
                  onClick={() => {
                    if (editingHourSpanDate !== 'endDate') {
                      setEditingHourSpanDate('endDate');
                    }
                  }}
                  ref={hourSpanEndDateRef}
                  className={`rounded-md text-lg text-black font-normal whitespace-nowrap truncate after:px-2 ${
                    editingHourSpanDate === 'endDate' ? '!ring-2 !ring-black' : ''
                  }`}>
                  {moment(hourSpanDates.endDate).format('HH:mm') + '\u00A0Uhr'}
                </span>
                {editingHourSpanDate === 'endDate' && (
                  <TimePicker
                    className="absolute z-10 top-8"
                    value={new Date(hourSpanDates.endDate)}
                    ref={hourSpanEndDatePickerRef}
                    minDate={new Date(hourSpanDates.startDate)}
                    maxDate={new Date(survey.endDate)}
                    onChange={(date) => {
                      const correctedDate = new Date(date);

                      // TimePicker only details down to minutes, also set smaller values to max, to include all votes to this specific hour and minute
                      correctedDate.setSeconds(59, 999);

                      setHourSpanDates((prev) => ({
                        ...prev,
                        endDate: correctedDate.toISOString()
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {survey && (displayOptions.absolute || displayOptions.daySpan || displayOptions.hourSpan) && (
        <div className="w-[calc(100%-40px)] flex flex-col items-start justify-center rounded-lg bg-white border border-gray-200 gap-2 p-6">
          <span className="text-xl font-semibold whitespace-nowrap truncate">Abstimmungen</span>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            {survey.questions.map((question, index) => {
              return (
                <VotingsQuestionCard
                  key={'question_' + index}
                  survey={survey}
                  question={question}
                  displayOptions={displayOptions}
                  absoluteVotings={absoluteVotings}
                  daySpanVotings={daySpanVotings}
                  hourSpanVotings={hourSpanVotings}></VotingsQuestionCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Votings;
