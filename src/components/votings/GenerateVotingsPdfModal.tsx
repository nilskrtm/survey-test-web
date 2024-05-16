import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { Survey } from '../../data/types/survey.types';
import Modal from '../layout/modal/Modal';
import { Document, Page, BlobProvider, View, Text, Image } from '@react-pdf/renderer';
import { registerInterFontPdf } from '../../utils/pdf/pdf.util';
import { Question } from '../../data/types/question.types';
import AbsoluteVotingsChart, { AbsoluteVotingsChartData } from './charts/AbsoluteVotingsChart';
import { VotingsDisplayOptions } from '../../app/votings/Votings';
import DaySpanVotingsChart, { DaySpanVotingsChartData } from './charts/DaySpanVotingsChart';
import HourSpanVotingsChart, { HourSpanVotingsChartData } from './charts/HourSpanVotingsChart';

type GenerateVotingsPdfModalProps = {
  survey: Survey;
  displayOptions: VotingsDisplayOptions;
  absoluteVotings: AbsoluteVotingsChartData;
  daySpanVotings: DaySpanVotingsChartData;
  hourSpanVotings: HourSpanVotingsChartData;
};

export type GenerateVotingsPdfModalRefAttributes = {
  open: () => void;
};

const GenerateVotingsPdfModal: ForwardRefRenderFunction<
  GenerateVotingsPdfModalRefAttributes,
  GenerateVotingsPdfModalProps
> = (props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const refSetLoading = useRef(setLoading);
  const refSetError = useRef(setError);

  const [fallbackTimeout, setFallbackTimeout] = useState<ReturnType<typeof setTimeout>>();

  const votingsChartCanvasRefs = useRef<Array<HTMLCanvasElement | undefined>>([]);

  const orderedQuestions = props.survey.questions.sort(
    (questionA, questionB) => questionA.order - questionB.order
  );

  const updateLoading = () => {
    for (const question of orderedQuestions) {
      if (!votingsChartCanvasRefs.current[question.order - 1]) {
        return;
      }
    }

    setLoading(false);
    setError(false);
  };

  useImperativeHandle<GenerateVotingsPdfModalRefAttributes, GenerateVotingsPdfModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          votingsChartCanvasRefs.current = [];

          setLoading(true);
          setError(false);
          setVisible(true);

          setFallbackTimeout(
            setTimeout(() => {
              for (const question of orderedQuestions) {
                if (!votingsChartCanvasRefs.current[question.order - 1]) {
                  refSetError.current(true);
                  refSetLoading.current(false);
                  return;
                }
              }
            }, 3000)
          );
        }
      }
    }),
    [visible]
  );

  useEffect(() => {
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
    }
  }, []);

  registerInterFontPdf();

  const onClose = () => {
    if (visible) {
      setVisible(false);
      setLoading(false);
      setError(false);
      votingsChartCanvasRefs.current = [];
    }
  };

  const PdfCover: (props: { survey: Survey }) => React.JSX.Element = (props) => {
    return (
      <Page
        size="A4"
        bookmark={{ title: 'Abstimmungen: ' + props.survey.name, fit: true }}
        style={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          paddingTop: '0.8cm',
          paddingBottom: '0.8cm',
          paddingLeft: '0.5cm',
          paddingRight: '0.5cm',
          fontFamily: 'Inter',
          fontWeight: 'normal'
        }}
        id="cover"
        wrap={true}></Page>
    );
  };

  const PdfHeader: (props: { question: Question }) => React.JSX.Element = (props) => {
    return (
      <View style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '2mm'
          }}>
          <Text
            style={{
              fontWeight: 'semibold',
              color: 'rgb(126 34 206)',
              paddingHorizontal: '2mm'
            }}>
            {props.question.order}.
          </Text>
          <Text style={{ flex: 1, fontWeight: 'normal' }}>{props.question.question}</Text>
        </View>
        <View
          style={{
            width: '100%',
            height: '0.5mm',
            backgroundColor: 'black',
            marginVertical: '1mm'
          }}
        />
      </View>
    );
  };

  const PdfFooter: (props: { survey: Survey }) => React.JSX.Element = (props) => {
    return (
      <View style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <View
          style={{
            width: '100%',
            height: '0.5mm',
            backgroundColor: 'black',
            marginVertical: '1mm'
          }}
        />
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '1mm'
          }}>
          <Text
            style={{
              fontWeight: 'semibold',
              color: 'rgb(126 34 206)'
            }}>
            Umfrage:
          </Text>
          <Text style={{ flex: 1, fontWeight: 'normal' }}>{props.survey.name}</Text>
        </View>
      </View>
    );
  };

  const pdfDocument = (
    <Document
      creationDate={new Date()}
      title="Abstimmungen"
      pageMode="useOutlines"
      pageLayout="singlePage">
      <PdfCover survey={props.survey} />
      {orderedQuestions.map((question) => {
        return (
          <Page
            size="A4"
            orientation="landscape"
            bookmark={{ title: 'Frage ' + question.order + ': ' + question.question, fit: true }}
            style={{
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              paddingTop: '0.8cm',
              paddingBottom: '0.8cm',
              paddingLeft: '0.8cm',
              paddingRight: '0.8cm',
              fontFamily: 'Inter',
              fontWeight: 'normal',
              fontSize: 12
            }}
            wrap={true}
            id={'question_' + question._id}
            key={'question_' + question._id}>
            <PdfHeader question={question} />
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingHorizontal: '2mm',
                paddingVertical: '5mm'
              }}>
              <View style={{ width: '100%' }}>
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 'normal'
                  }}>
                  {props.displayOptions.absolute
                    ? 'Gesamter Zeitraum'
                    : props.displayOptions.daySpan
                      ? 'Zeitraum (Tage)'
                      : 'Zeitraum (Stunden)'}
                </Text>
              </View>
              <View style={{ width: '100%' }}>
                {votingsChartCanvasRefs.current[question.order - 1] && (
                  <Image
                    src={votingsChartCanvasRefs.current[question.order - 1]?.toDataURL()}
                    style={{ width: '100%' }}
                  />
                )}
              </View>
            </View>
            <PdfFooter survey={props.survey} />
          </Page>
        );
      })}
    </Document>
  );

  return (
    <>
      <Modal
        className="w-full"
        closeable={true}
        onRequestClose={onClose}
        title="PDF Generieren"
        visible={visible}>
        <div className="w-full flex flex-col items-start justify-center">
          <span className="text-base text-black font-normal">
            Es wird eine PDF-Datei bereitgestellt, welche die Abstimmungen zu der Umfrage in dem
            ausgewählten Kontext darstellt.
          </span>
          {(loading || error) && <br />}
          {loading && !error && (
            <span className="text-base text-black font-semibold loading-dots">
              Die PDF-Datei wird generiert
            </span>
          )}
          {error && (
            <span className="text-base text-red-500 font-semibold">
              Es ist ein Fehler beim Generieren der PDF-Datei aufgetreten.
            </span>
          )}
          <div className="w-full flex flex-row items-center justify-end mt-4">
            <BlobProvider document={pdfDocument}>
              {({ blob }) => (
                <button
                  className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
                  disabled={!blob || loading || error}
                  onClick={() => {
                    if (blob && !loading && !error) {
                      const url = URL.createObjectURL(blob);

                      window.open(url);
                    }
                  }}
                  title="PDF Öffnen">
                  Öffnen
                </button>
              )}
            </BlobProvider>
          </div>
        </div>
      </Modal>

      {/* absolute votings chart-render div */}
      {visible &&
        props.displayOptions.absolute &&
        !props.absoluteVotings.loading &&
        !props.absoluteVotings.error && (
          <div className="absolute top-0 left-0 w-[1px] h-[2px] z-[-1] overflow-hidden">
            {orderedQuestions.map((question) => {
              const orderedAnswerOptions = question.answerOptions.sort(
                (answerOptionA, answerOptionB) => answerOptionA.order - answerOptionB.order
              );

              return (
                <div className="w-[1400px] h-[778px]" key={'absoluteChart_' + question._id}>
                  <AbsoluteVotingsChart
                    absoluteVotings={props.absoluteVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight="250px"
                    renderCallback={(chart) => {
                      votingsChartCanvasRefs.current[question.order - 1] =
                        chart.getContext().chart.canvas;

                      updateLoading();
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

      {/* day-span votings chart-render div */}
      {visible &&
        props.displayOptions.daySpan &&
        !props.daySpanVotings.loading &&
        !props.daySpanVotings.error && (
          <div className="absolute top-0 left-0 w-[1px] h-[2px] z-[-1] overflow-hidden">
            {orderedQuestions.map((question) => {
              const orderedAnswerOptions = question.answerOptions.sort(
                (answerOptionA, answerOptionB) => answerOptionA.order - answerOptionB.order
              );

              return (
                <div className="w-[1400px] h-[778px]" key={'daySpanChart_' + question._id}>
                  <DaySpanVotingsChart
                    daySpanVotings={props.daySpanVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight="250px"
                    renderCallback={(chart) => {
                      votingsChartCanvasRefs.current[question.order - 1] =
                        chart.getContext().chart.canvas;

                      updateLoading();
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

      {/* day-span votings chart-render div */}
      {visible &&
        props.displayOptions.hourSpan &&
        !props.hourSpanVotings.loading &&
        !props.hourSpanVotings.error && (
          <div className="absolute top-0 left-0 w-[1px] h-[2px] z-[-1] overflow-hidden">
            {orderedQuestions.map((question) => {
              const orderedAnswerOptions = question.answerOptions.sort(
                (answerOptionA, answerOptionB) => answerOptionA.order - answerOptionB.order
              );

              return (
                <div className="w-[1400px] h-[778px]" key={'hourSpanChart_' + question._id}>
                  <HourSpanVotingsChart
                    hourSpanVotings={props.hourSpanVotings}
                    orderedAnswerOptions={orderedAnswerOptions}
                    placeHolderHeight="250px"
                    renderCallback={(chart) => {
                      votingsChartCanvasRefs.current[question.order - 1] =
                        chart.getContext().chart.canvas;

                      updateLoading();
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
    </>
  );
};

export default forwardRef<GenerateVotingsPdfModalRefAttributes, GenerateVotingsPdfModalProps>(
  GenerateVotingsPdfModal
);
