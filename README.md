![Build](https://github.com/nilskrtm/survey-test-web/actions/workflows/push.yml/badge.svg)

# Survey WebApp

This repository is part of a hobby project for creating, managing, conducting and evaluating surveys.<br/>
The surveys can be managed in a WebApp and are carried out in the [(Android) app](https://github.com/nilskrtm/SurveyTestApp) on tablets, for example. There, a survey runs in a kiosk mode. This allows these devices to be displayed in service outlets, trade fairs or other locations, allowing you to gather customer satisfaction through a simple survey.<br/>
For the questions, there is no answer option in text form, but only through images, which should be selected to match the corresponding answer option.

The project also involves the following two repositories:

- [Survey Backend](https://github.com/nilskrtm/survey-test-api)
- [Survey App](https://github.com/nilskrtm/SurveyTestApp)

> This whole project is still a _WIP_ and there are still some [improvements](#todos-and-improvements) I want to make but haven't had the time yet.

## Overview

<b>This module</b> represents the <b>frontend (WebApp)</b> of the system in form of an <b>React</b> app. For data manipulation, requests are sent to the Rest API via web requests.

## Configuration

There are some properties that have to be set to when running the WebApp, like the endpoint of the Rest API. For this, there is a set of environment variables that can be set. The best way is to just use a _.env_ file.

### List of Properties

<b>TODO</b> (or see .env.example [.env.example](https://github.com/nilskrtm/survey-test-web/blob/master/.env.example))

## Running the App

Start development server:

```bash
npm run start
```

Start preview:

```bash
npm run build && npm run serve
```

## Todos and Improvements

- improve security of authentication
  - store JWTs in Cookies rather than in local storage (also a TODO for the backend)
- declutter styling by wrapping frequently used classes to one using tailwind
  - e.g. not styling each button on its own, rather providing of like a .button class
- create more custom components to declutter code
  - e.g. buttons, inputs, selects and so on
- I have a few questionable while loops in the DatePicker and DatetimePicker component, which can technically be replaced by if statements
- remove prop drilling from some modals (e.g. QuestionModal, ReorderQuestionsModal, ReorderAnswerOptionsModal, AnswerOptionColorModal, AnswerOptionPictureModal)
  - maybe use context or redux (which I already used in some other cases)
- improve PDF generation
  - the current implementation I use to get the charts into a pdf-file are very dirty and more a workaround than a solution
- finish user-management section
- finish imprint page and add possibility to edit content dynamically
- ...
