import React from 'react';
import ChartPlaceholder from './ChartPlaceHolder';
import { AnswerOption } from '../../../data/types/answer.option.types';
import {
  BarElement,
  CategoryScale,
  type Chart,
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
  renderCallback?: (chart: Chart<'bar', (number | [number, number] | null)[], unknown>) => void;
  absoluteVotings: AbsoluteVotingsChartData;
  orderedAnswerOptions: Array<AnswerOption>;
  placeHolderHeight: string;
};

const AbsoluteVotingsChart: (props: AbsoluteVotingsChartProps) => React.JSX.Element = (props) => {
  const votingsData = props.absoluteVotings;

  if (votingsData.loading || votingsData.error) {
    return (
      <ChartPlaceholder
        loading={props.absoluteVotings.loading}
        error={props.absoluteVotings.error}
        height={props.placeHolderHeight}
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
      plugins={[
        {
          id: 'canvasCallback',
          afterRender: (chart) => {
            if (props.renderCallback) {
              props.renderCallback(chart);
            }
          }
        }
      ]}
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
            position: 'left',
            title: { display: true, color: 'black', text: 'Abstimmungen' },
            ticks: {
              callback: (val) => {
                return !val.toString().includes(',') && !val.toString().includes('.') ? val : '';
              }
            }
          },
          yFake: {
            display: true,
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: { display: true, color: 'black', text: 'Abstimmungen' },
            ticks: {
              callback: () => {
                return '';
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
