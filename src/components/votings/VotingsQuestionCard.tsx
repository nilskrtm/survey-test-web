import React from 'react';
import { Survey } from '../../data/types/survey.types';
import useCollapse from '../../utils/hooks/use.collapse.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Question } from '../../data/types/question.types';
import { AbsoluteVotingsData, DaySpanVotingsData } from '../../app/votings/Votings';
import moment from 'moment/moment';
import { BounceLoader } from 'react-spinners';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

type ChartPlaceholderProps = {
  loading: boolean;
  error: boolean;
  height: string;
};

const ChartPlaceholder: (props: ChartPlaceholderProps) => React.JSX.Element = (props) => {
  if (!props.loading && !props.error) return <></>;

  return (
    <div
      className="w-full flex flex-col items-center justify-center space-y-4"
      style={{ height: props.height }}>
      {props.loading ? (
        <BounceLoader color="rgb(126 34 206)" size={70} />
      ) : (
        <>
          <FontAwesomeIcon icon={faExclamation} size="1x" className="text-3xl text-red-500" />
          <p className="text-medium font-medium text-gray-700">Abruf der Daten fehlgeschlagen</p>
        </>
      )}
    </div>
  );
};

type VotingsQuestionCardProps = {
  survey: Survey;
  question: Question;
  displayOptions: { absolute: boolean; daySpan: boolean; hourSpan: boolean };
  absoluteVotings: AbsoluteVotingsData;
  daySpanVotings: DaySpanVotingsData;
};

const CHART_HEIGHT = '250px';

const VotingsQuestionCard: (props: VotingsQuestionCardProps) => React.JSX.Element = (props) => {
  const [collapsed, collapser] = useCollapse(true);

  const orderedAnswerOptions = props.question.answerOptions.sort(
    (answerOptionA, answerOptionB) => answerOptionA.order - answerOptionB.order
  );

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-lg border border-gray-200 py-2">
      <button
        className="w-full flex flex-row items-center justify-start group"
        type="button"
        onClick={collapser}>
        <div className="h-8 w-12 flex items-center justify-center p-4 select-none">
          <span className="text-xl font-medium text-purple-700">{props.question.order}</span>
        </div>
        <div className="flex-grow flex flex-col items-start justify-center">
          <span className="text-lg font-medium">{props.question.question}</span>
        </div>
        <div className="w-10 h-full px-6">
          <div className="w-full flex flex-col items-center justify-start">
            {!collapsed ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                size="1x"
                className="text-xl text-gray-600 group-hover:text-black"
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                size="1x"
                className="text-xl text-gray-600 group-hover:text-black"
              />
            )}
          </div>
        </div>
      </button>
      {!collapsed && (
        <>
          <hr className="w-full m-2" />
          <div className="w-full flex flex-col items-start justify-center px-6 gap-2">
            {/*
            <div className="w-full flex flex-col items-start justify-center">
              <span className="w-full text-center text-lg text-black font-medium">
                Antwortmöglichkeiten
              </span>
              <div className="w-full flex flex-row items-center justify-center"></div>
            </div>
            */}
            {props.displayOptions.absolute && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Gesamter Zeitraum
                </span>
                <div className="w-full flex flex-row items-center justify-center">
                  <ChartPlaceholder
                    loading={props.absoluteVotings.loading}
                    error={props.absoluteVotings.error}
                    height={CHART_HEIGHT}
                  />
                  {!props.absoluteVotings.loading && !props.absoluteVotings.error && (
                    <Bar
                      width="100%"
                      height={CHART_HEIGHT}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        backgroundColor: 'transparent',
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            enabled: true,
                            callbacks: {
                              title: function (this, item) {
                                return 'Antwortmöglichkeit ' + (Number(item[0].dataIndex) + 1);
                              },
                              label: function (this, item) {
                                const votes = Number(item.dataset.data[item.dataIndex]);

                                return (
                                  ' ' +
                                  votes +
                                  ' Abstimmung' +
                                  (votes !== 0 && votes > 1 ? 'en' : '')
                                );
                              }
                            },
                            position: 'nearest'
                          },
                          datalabels: {
                            color: 'white',
                            font: {
                              weight: 'bold'
                            }
                          }
                        },
                        scales: {
                          x: {
                            display: true,
                            type: 'category',
                            title: { display: true, color: 'black', text: 'Antwortmöglichkeit' }
                          },
                          y: {
                            beginAtZero: true,
                            display: true,
                            type: 'linear',
                            title: { display: true, color: 'black', text: 'Abstimmungen' },
                            ticks: {
                              callback: (val) => {
                                return !val.toString().includes(',') &&
                                  !val.toString().includes('.')
                                  ? val
                                  : '';
                              }
                            }
                          }
                        }
                      }}
                      data={{
                        labels: orderedAnswerOptions.map((answerOption) => {
                          return answerOption.order;
                        }),
                        datasets: [
                          {
                            label: 'Abstimmungen',
                            backgroundColor: orderedAnswerOptions.map(
                              (answerOption) => answerOption.color
                            ),
                            data: orderedAnswerOptions.map((answerOption) => {
                              return props.absoluteVotings.votesByAnswerOption[answerOption._id];
                            })
                          }
                        ]
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            {props.displayOptions.daySpan && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Zeitraum (Tage)
                </span>
                <div className="w-full flex flex-row items-center justify-center">
                  <ChartPlaceholder
                    loading={props.daySpanVotings.loading}
                    error={props.daySpanVotings.error}
                    height={CHART_HEIGHT}
                  />
                  {!props.daySpanVotings.loading && !props.daySpanVotings.error && (
                    <Bar
                      width="100%"
                      height={CHART_HEIGHT}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        backgroundColor: 'transparent',
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            enabled: true,
                            callbacks: {
                              title: function (this, item) {
                                return [
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  moment(item[0].dataset.data[item[0].dataIndex].date).format(
                                    'DD.MM.YYYY'
                                  ),
                                  'Antwortmöglichkeit ' + (Number(item[0].datasetIndex) + 1)
                                ];
                              },
                              label: function (this, item) {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const votes = Number(item.dataset.data[item.dataIndex].votes | 0);

                                return (
                                  ' ' +
                                  votes +
                                  ' Abstimmung' +
                                  (votes !== 0 && votes > 1 ? 'en' : '')
                                );
                              }
                            },
                            position: 'nearest'
                          },
                          datalabels: {
                            formatter: function (_value, context) {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              const votes = context.dataset.data[context.dataIndex].votes | 0;

                              return votes === 0 ? '' : votes;
                            },
                            color: 'white',
                            font: {
                              weight: 'bold'
                            }
                          }
                        },
                        scales: {
                          x: {
                            display: true,
                            type: 'category',
                            grid: {
                              offset: true
                            },
                            ticks: {
                              callback: (value, index) => {
                                const day = props.daySpanVotings.days.at(index);

                                return day ? moment(new Date(day)).format('DD.MM.YYYY') : value;
                              }
                            },
                            title: { display: true, color: 'black', text: 'Tag der Abstimmung' }
                          },
                          y: {
                            display: true,
                            beginAtZero: true,
                            type: 'linear',
                            stacked: true,
                            ticks: {
                              callback: (val) => {
                                return !val.toString().includes(',') &&
                                  !val.toString().includes('.')
                                  ? val
                                  : '';
                              }
                            },
                            title: {
                              display: true,
                              color: 'black',
                              text: 'Abstimmungen je Antwortmöglichkeit'
                            }
                          }
                        }
                      }}
                      data={{
                        labels: props.daySpanVotings.days,
                        datasets: orderedAnswerOptions.map((answerOption) => {
                          return {
                            label: 'Antwortmöglichkeit ' + answerOption.order,
                            stack: 'stack',
                            backgroundColor: answerOption.color,
                            data: props.daySpanVotings.votesByAnswerOption[answerOption._id],
                            parsing: {
                              xAxisKey: 'date',
                              yAxisKey: 'votes'
                            }
                          };
                        })
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            {props.displayOptions.hourSpan && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Zeitraum (Stunden)
                </span>
                <div className="w-full flex flex-row items-center justify-center"></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VotingsQuestionCard;
