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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export type AbsoluteVotingsChartData = {
  loading: boolean;
  error: boolean;
  votesByAnswerOption: {
    [answerOptionId: string]: number;
  };
};

type AbsoluteVotingsChartProps = {
  absoluteVotings: AbsoluteVotingsChartData;
  orderedAnswerOptions: Array<AnswerOption>;
  height: string;
};

const AbsoluteVotingsChart: (props: AbsoluteVotingsChartProps) => React.JSX.Element = (props) => {
  const votingsData = props.absoluteVotings;

  if (votingsData.loading || votingsData.error) {
    return (
      <ChartPlaceholder
        loading={props.absoluteVotings.loading}
        error={props.absoluteVotings.error}
        height={props.height}
      />
    );
  }

  const labels = props.orderedAnswerOptions.map((answerOption) => {
    return answerOption.order;
  });
  const backgroundColors = props.orderedAnswerOptions.map((answerOption) => answerOption.color);
  const data = props.orderedAnswerOptions.map((answerOption) => {
    return votingsData.votesByAnswerOption[answerOption._id];
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
                return 'Antwortmöglichkeit ' + (Number(item[0].dataIndex) + 1);
              },
              label: function (this, item) {
                const votes = Number(item.dataset.data[item.dataIndex]);

                return ' ' + votes + ' Abstimmung' + (votes !== 0 && votes > 1 ? 'en' : '');
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
                return !val.toString().includes(',') && !val.toString().includes('.') ? val : '';
              }
            }
          }
        }
      }}
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Abstimmungen',
            backgroundColor: backgroundColors,
            data: data
          }
        ]
      }}
    />
  );
};

export default AbsoluteVotingsChart;
