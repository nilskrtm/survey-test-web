import React from 'react';
import { Survey } from '../../data/types/survey.types';
import useCollapse from '../../utils/hooks/use.collapse.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type VotingsQuestionCardProps = {
  survey: Survey;
  questionId: string;
  displayOptions: { absolute: boolean; daySpan: boolean; hourSpan: boolean };
  absoluteVotings: {
    loading: boolean;
    error: boolean;
    questions: {
      [questionId: string]: {
        answerOptions: { [answerOptionId: string]: number };
      };
    };
  };
};

const VotingsQuestionCard: (props: VotingsQuestionCardProps) => React.JSX.Element = (props) => {
  const question = props.survey.questions.find((question) => question._id === props.questionId);

  const [collapsed, collapser] = useCollapse(true);

  if (!question) return <></>;

  const orderedAnswerOptions = question.answerOptions.sort(
    (answerOptionA, answerOptionB) => answerOptionA.order - answerOptionB.order
  );
  const absoluteVotingsData: Array<number> = [];

  if (
    !props.absoluteVotings.loading &&
    !props.absoluteVotings.error &&
    props.questionId in props.absoluteVotings.questions
  ) {
    const absoluteQuestionVotings = props.absoluteVotings.questions[props.questionId];

    orderedAnswerOptions.forEach((answerOption) => {
      if (answerOption._id in absoluteQuestionVotings.answerOptions) {
        absoluteVotingsData.push(absoluteQuestionVotings.answerOptions[answerOption._id]);
      }
    });
  }

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-lg border border-gray-200 py-2">
      <button
        className="w-full flex flex-row items-center justify-start group"
        type="button"
        onClick={collapser}>
        <div className="h-8 w-12 flex items-center justify-center p-4 select-none">
          <span className="text-xl font-medium text-purple-700">{question.order}</span>
        </div>
        <div className="flex-grow flex flex-col items-start justify-center">
          <span className="text-lg font-medium">{question.question}</span>
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
                  <Bar
                    width="100%"
                    height="250px"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      backgroundColor: 'white',
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            title: function (this, item) {
                              return 'Antwortmöglichkeit ' + (Number(item[0].dataIndex) + 1);
                            },
                            label: function (this, item) {
                              return (
                                ' ' + Number(item.dataset.data[item.dataIndex]) + ' Abstimmungen'
                              );
                            }
                          },
                          position: 'nearest'
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
                              return !val.toString().includes(',') && !val.toString().includes('.')
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
                          data: absoluteVotingsData
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            )}
            {props.displayOptions.daySpan && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Zeitraum (Tage)
                </span>
                <div className="w-full flex flex-row items-center justify-center"></div>
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
