import { Survey } from '../../data/types/survey.types';
import { AnswerPicture } from '../../data/types/answer.picture.types';
import { Question } from '../../data/types/question.types';
import { AnswerOption } from '../../data/types/answer.option.types';

export const dummySurvey: () => Survey = () => {
  return {
    _id: 'dummy',
    name: '',
    description: '',
    greeting: '',
    startDate: '',
    endDate: '',
    owner: '',
    created: '',
    edited: '',
    draft: false,
    archived: false,
    questions: []
  };
};

export const dummyQuestion: () => Question = () => {
  return {
    _id: 'dummy',
    question: '',
    timeout: -1,
    order: 1,
    answerOptions: []
  };
};

export const dummyAnswerOption: () => AnswerOption = () => {
  return {
    _id: 'dummy',
    color: '',
    order: 1,
    picture: undefined as unknown as AnswerPicture
  };
};

export const isSurveyFinalizeable: (survey: Survey) => boolean = (survey) => {
  const surveyStartDate = new Date(survey.startDate).getTime();
  const surveyEndDate = new Date(survey.endDate).getTime();
  const currentDate = new Date().getTime();

  if (
    surveyStartDate < surveyEndDate &&
    surveyEndDate > currentDate &&
    survey.questions.length > 0
  ) {
    const allQuestionsValid = survey.questions.every((questionObject) => {
      return (
        questionObject.question.length > 0 &&
        questionObject.timeout >= 0 &&
        questionObject.order > 0 &&
        questionObject.answerOptions.length > 0
      );
    });
    const questionsOrderValid =
      survey.questions.reduce(
        (accumulator: number, questionObject) => accumulator + questionObject.order,
        0
      ) ==
      Array.from(Array(survey.questions.length + 1).keys()).reduce(
        (accumulator, value) => accumulator + value,
        0
      );

    if (allQuestionsValid && questionsOrderValid) {
      let allQuestionsAnswerOptionsValid = true;
      let answerOptionsOrderValid = true;

      for (const questionObject of survey.questions) {
        if (
          !questionObject.answerOptions.every((answerOptionObject) => {
            return (
              answerOptionObject.picture && answerOptionObject.color && answerOptionObject.order > 0
            );
          })
        ) {
          allQuestionsAnswerOptionsValid = false;

          break;
        }

        if (
          questionObject.answerOptions.reduce(
            (accumulator: number, answerOptionObject) => accumulator + answerOptionObject.order,
            0
          ) !==
          Array.from(Array(questionObject.answerOptions.length + 1).keys()).reduce(
            (accumulator, value) => accumulator + value,
            0
          )
        ) {
          answerOptionsOrderValid = false;

          break;
        }
      }

      if (allQuestionsAnswerOptionsValid && answerOptionsOrderValid) {
        const answerPictureObjects: AnswerPicture[] = [];

        for (const questionObject of survey.questions) {
          for (const answerOptionObject of questionObject.answerOptions) {
            answerPictureObjects.push(answerOptionObject.picture);
          }
        }

        const allAnswerPicturesValid = answerPictureObjects.every((answerPictureObject) => {
          return answerPictureObject.name && answerPictureObject.fileName;
        });

        if (allAnswerPicturesValid) {
          return true;
        }
      }
    }
  }

  return false;
};
