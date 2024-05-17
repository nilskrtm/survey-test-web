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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Question } from '../../data/types/question.types';
import AbsoluteVotingsChart, { AbsoluteVotingsChartData } from './charts/AbsoluteVotingsChart';
import DaySpanVotingsChart, { DaySpanVotingsChartData } from './charts/DaySpanVotingsChart';
import HourSpanVotingsChart, { HourSpanVotingsChartData } from './charts/HourSpanVotingsChart';
import { VotingsDisplayOptions } from '../../app/votings/Votings';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

type VotingsQuestionCardProps = {
  survey: Survey;
  question: Question;
  displayOptions: VotingsDisplayOptions;
  absoluteVotings: AbsoluteVotingsChartData;
  daySpanVotings: DaySpanVotingsChartData;
  hourSpanVotings: HourSpanVotingsChartData;
};

const CHART_HEIGHT = '300px';

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
          <span className="w-full text-lg font-medium text-left">{props.question.question}</span>
        </div>
        <div className="w-10 h-full flex flex-col items-center justify-center px-6">
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
                <div
                  className="w-full flex flex-row items-center justify-center"
                  style={{ height: CHART_HEIGHT }}>
                  <AbsoluteVotingsChart
                    absoluteVotings={props.absoluteVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight={CHART_HEIGHT}
                  />
                </div>
              </div>
            )}
            {props.displayOptions.daySpan && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Zeitraum (Tage)
                </span>
                <div
                  className="w-full flex flex-row items-center justify-center"
                  style={{ height: CHART_HEIGHT }}>
                  <DaySpanVotingsChart
                    daySpanVotings={props.daySpanVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight={CHART_HEIGHT}
                  />
                </div>
              </div>
            )}
            {props.displayOptions.hourSpan && (
              <div className="w-full flex flex-col items-start justify-center">
                <span className="w-full text-center text-lg text-black font-medium">
                  Zeitraum (Stunden)
                </span>
                <div
                  className="w-full flex flex-row items-center justify-center"
                  style={{ height: CHART_HEIGHT }}>
                  <HourSpanVotingsChart
                    hourSpanVotings={props.hourSpanVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight={CHART_HEIGHT}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VotingsQuestionCard;
