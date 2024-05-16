import React from 'react';
import ChartPlaceholder from './ChartPlaceHolder';
import { AnswerOption } from '../../../data/types/answer.option.types';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { HourSpanVotingsResponse, HourVotings } from '../../../data/types/voting.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export type HourSpanVotingsChartData = Pick<HourSpanVotingsResponse, 'hours'> & {
  loading: boolean;
  error: boolean;
  votesByAnswerOption: {
    [answerOptionId: string]: Array<HourVotings>;
  };
};

type HourSpanVotingsChartProps = {
  hourSpanVotings: HourSpanVotingsChartData;
  orderedAnswerOptions: Array<AnswerOption>;
  height: string;
};

const HourSpanVotingsChart: (props: HourSpanVotingsChartProps) => React.JSX.Element = (props) => {
  const votingsData = props.hourSpanVotings;

  if (votingsData.loading || votingsData.error) {
    return (
      <ChartPlaceholder
        loading={votingsData.loading}
        error={votingsData.error}
        height={props.height}
      />
    );
  }

  const labels = votingsData.hours;
  const datasets = props.orderedAnswerOptions.map((answerOption) => {
    return {
      label: 'Antwortmöglichkeit ' + answerOption.order,
      stack: 'stack',
      backgroundColor: answerOption.color,
      data: votingsData.votesByAnswerOption[answerOption._id],
      parsing: {
        xAxisKey: 'hour',
        yAxisKey: 'votes'
      }
    };
  });

  return (
    <Bar
      width="100%"
      height={props.height}
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
                  item[0].dataset.data[item[0].dataIndex].hour + ':00 Uhr',
                  'Antwortmöglichkeit ' + (Number(item[0].datasetIndex) + 1)
                ];
              },
              label: function (this, item) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const votes = Number(item.dataset.data[item.dataIndex].votes | 0);

                return ' ' + votes + ' Abstimmung' + (votes !== 0 && votes > 1 ? 'en' : '');
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
              align: 'end',
              callback: (value, index) => {
                const hour = props.hourSpanVotings.hours.at(index);

                return hour ? hour + ':00 Uhr' : value;
              }
            },
            title: { display: true, color: 'black', text: 'Stunde der Abstimmung' }
          },
          y: {
            display: true,
            beginAtZero: true,
            type: 'linear',
            stacked: true,
            ticks: {
              callback: (val) => {
                return !val.toString().includes(',') && !val.toString().includes('.') ? val : '';
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
        labels: labels,
        datasets: datasets
      }}
    />
  );
};

export default HourSpanVotingsChart;
