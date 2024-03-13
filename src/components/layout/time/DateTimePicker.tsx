import React, { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';

const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

type DateTimePickerProps = Pick<React.JSX.IntrinsicElements['div'], 'className'> & {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
};

type ListenValues = {
  month: number;
  year: number;
  hour: number;
  minute: number;
};

type CalculatedDay = {
  day: number;
  disabled: boolean;
  isDay: boolean;
};

type DayCalculation = {
  daysInMonth: number;
  startDay: number;
  endDay: number;
  squares: CalculatedDay[];
  dayRows: CalculatedDay[][];
};

const DateTimePicker: ForwardRefRenderFunction<HTMLDivElement, DateTimePickerProps> = (
  props,
  ref
) => {
  const [listenValues, setListenValues] = useState<ListenValues>({
    month: 0,
    year: 0,
    hour: 0,
    minute: 0
  });
  const [dayCalculation, setDayCalculation] = useState<DayCalculation>({
    daysInMonth: 0,
    startDay: 0,
    endDay: 0,
    squares: [],
    dayRows: []
  });

  useEffect(() => {
    newDateInput();
  }, [props.value, props.minDate, props.maxDate]);

  const newDateInput = () => {
    updateDays(
      {
        month: props.value.getMonth() + 1,
        year: props.value.getFullYear(),
        hour: props.value.getHours(),
        minute: props.value.getMinutes()
      },
      dayCalculation
    );
  };

  const updateDays = (oldListenValues: ListenValues, oldDayCalculation: DayCalculation) => {
    const selectedYear = oldListenValues.year;
    const selectedMonth = oldListenValues.month;
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const newListenValues: ListenValues = Object.assign({}, oldListenValues);
    const newDayCalculation: DayCalculation = Object.assign({}, oldDayCalculation);

    newDayCalculation.daysInMonth = daysInMonth;
    newDayCalculation.startDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    newDayCalculation.endDay = new Date(selectedYear, selectedMonth - 1, daysInMonth).getDay();
    newDayCalculation.startDay = newDayCalculation.startDay == 0 ? 7 : newDayCalculation.startDay;
    newDayCalculation.endDay = newDayCalculation.endDay == 0 ? 7 : newDayCalculation.endDay;
    newDayCalculation.dayRows = [];
    newDayCalculation.squares = [];

    for (let i = 1; i < newDayCalculation.startDay; i++) {
      newDayCalculation.squares.push({
        day: -1,
        disabled: true,
        isDay: false
      });
    }

    let thisDay = newDayCalculation.startDay;

    for (let i = 1; i <= newDayCalculation.daysInMonth; i++) {
      // check if day is disabled
      const disabled = dayDisabled(i, newListenValues);

      newDayCalculation.squares.push({
        day: i,
        disabled: disabled,
        isDay: true
      });

      // next day
      thisDay++;

      // only 7 days in a week
      if (thisDay == 8) {
        thisDay = 1;
      }
    }

    for (let i = newDayCalculation.endDay; i < 7; i++) {
      newDayCalculation.squares.push({
        day: -1,
        disabled: true,
        isDay: false
      });
    }

    let counter = 0;
    let currentArray: CalculatedDay[] | null = null;

    for (const i in newDayCalculation.squares) {
      counter++;

      if (currentArray == null) {
        currentArray = [];
      }

      const elem = newDayCalculation.squares[i];

      currentArray.push(elem);

      if (counter == 7) {
        counter = 0;

        newDayCalculation.dayRows.push(currentArray);

        currentArray = null;
      }
    }

    setListenValues(newListenValues);
    setDayCalculation(newDayCalculation);
  };

  const monthDisabled: (monthNumber: number, newListenValues?: ListenValues) => boolean = (
    monthNumber,
    newListenValues
  ) => {
    let useListenValues: ListenValues = Object.assign({}, listenValues);

    if (newListenValues !== undefined) {
      useListenValues = newListenValues;
    }

    if (
      props.minDate &&
      props.maxDate &&
      (useListenValues.year == props.minDate.getFullYear() ||
        useListenValues.year == props.maxDate.getFullYear())
    ) {
      if (useListenValues.year == props.minDate.getFullYear()) {
        if (monthNumber < props.minDate.getMonth()) {
          return true;
        }
      }
      if (useListenValues.year == props.maxDate.getFullYear()) {
        if (monthNumber > props.maxDate.getMonth()) {
          return true;
        }
      }
    }
    if (props.minDate && useListenValues.year == props.minDate.getFullYear()) {
      if (monthNumber < props.minDate.getMonth()) {
        return true;
      }
    }
    if (props.maxDate && useListenValues.year == props.maxDate.getFullYear()) {
      if (monthNumber > props.maxDate.getMonth()) {
        return true;
      }
    }

    return false;
  };

  const yearDisabled: (year: number) => boolean = (year) => {
    if (props.minDate && props.maxDate) {
      return year < props.minDate.getFullYear() || year > props.maxDate.getFullYear();
    }
    if (props.minDate) {
      return year < props.minDate.getFullYear();
    }
    if (props.maxDate) {
      return year > props.maxDate.getFullYear();
    }

    return false;
  };

  const dayDisabled: (day: number, useListenValues: ListenValues) => boolean = (
    day,
    useListenValues
  ) => {
    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == useListenValues.year &&
        props.minDate.getMonth() == useListenValues.month - 1
      ) {
        if (day < props.minDate.getDate()) {
          return true;
        }
      }
      if (
        props.maxDate.getFullYear() == useListenValues.year &&
        props.maxDate.getMonth() == useListenValues.month - 1
      ) {
        if (day > props.maxDate.getDate()) {
          return true;
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == useListenValues.year &&
        props.minDate.getMonth() == useListenValues.month - 1
      ) {
        if (day < props.minDate.getDate()) {
          return true;
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == useListenValues.year &&
        props.maxDate.getMonth() == useListenValues.month - 1
      ) {
        if (day > props.maxDate.getDate()) {
          return true;
        }
      }
    }

    return false;
  };

  const hourDisabled: (hour: number) => boolean = (hour) => {
    const selectedYear = props.value.getFullYear();
    const selectedMonth = props.value.getMonth();
    const selectedDay = props.value.getDate();

    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate()
      ) {
        if (hour < props.minDate.getHours()) {
          return true;
        }
      }
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate()
      ) {
        if (hour > props.maxDate.getHours()) {
          return true;
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate()
      ) {
        if (hour < props.minDate.getHours()) {
          return true;
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate()
      ) {
        if (hour > props.maxDate.getHours()) {
          return true;
        }
      }
    }

    return false;
  };

  const minuteDisabled: (minute: number) => boolean = (minute) => {
    const selectedYear = props.value.getFullYear();
    const selectedMonth = props.value.getMonth();
    const selectedDay = props.value.getDate();

    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        listenValues.hour == props.minDate.getHours()
      ) {
        if (minute < props.minDate.getMinutes()) {
          return true;
        }
      }
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        listenValues.hour == props.maxDate.getHours()
      ) {
        if (minute > props.maxDate.getMinutes()) {
          return true;
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        listenValues.hour == props.minDate.getHours()
      ) {
        if (minute < props.minDate.getMinutes()) {
          return true;
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        listenValues.hour == props.maxDate.getHours()
      ) {
        if (minute > props.maxDate.getMinutes()) {
          return true;
        }
      }
    }

    return false;
  };

  const changeMonth: (monthNumber: number) => void = (monthNumber) => {
    const newListenValues: ListenValues = { ...listenValues, month: monthNumber };

    // no need to correct year

    updateDays(newListenValues, dayCalculation);
  };

  const changeYear: (year: number) => void = (year) => {
    const newListenValues: ListenValues = { ...listenValues, year: year };

    // maybe need to correct month, because current selected month may be not in min-max range after changing year

    if (monthDisabled(newListenValues.month - 1, newListenValues)) {
      console.log('disabled');
      if (props.minDate && props.maxDate) {
        if (props.minDate.getFullYear() == newListenValues.year) {
          if (newListenValues.month - 1 < props.minDate.getMonth()) {
            while (newListenValues.month - 1 < props.minDate.getMonth()) {
              newListenValues.month = newListenValues.month + 1;

              if (newListenValues.month == 12) break;
            }
          }
        }
        if (props.maxDate.getFullYear() == newListenValues.year) {
          if (newListenValues.month - 1 > props.maxDate.getMonth()) {
            while (newListenValues.month - 1 > props.maxDate.getMonth()) {
              newListenValues.month = newListenValues.month - 1;

              if (newListenValues.month == 1) break;
            }
          }
        }
      }
      if (props.minDate) {
        if (props.minDate.getFullYear() == newListenValues.year) {
          if (newListenValues.month - 1 < props.minDate.getMonth()) {
            while (newListenValues.month - 1 < props.minDate.getMonth()) {
              newListenValues.month = newListenValues.month + 1;

              if (newListenValues.month == 12) break;
            }
          }
        }
      }
      if (props.maxDate) {
        if (props.maxDate.getFullYear() == newListenValues.year) {
          if (newListenValues.month - 1 > props.maxDate.getMonth()) {
            while (newListenValues.month - 1 > props.maxDate.getMonth()) {
              newListenValues.month = newListenValues.month - 1;

              if (newListenValues.month == 1) break;
            }
          }
        }
      }
    }

    updateDays(newListenValues, dayCalculation);
  };

  const changeDay: (dayNumber: number) => void = (dayNumber) => {
    const newListenValues: ListenValues = { ...listenValues };

    const newDate = new Date(newListenValues.year, newListenValues.month - 1, dayNumber);

    const selectedYear = newDate.getFullYear();
    const selectedMonth = newDate.getMonth();
    const selectedDay = newDate.getDate();

    // maybe need to correct hour, because current selected hour may not be in min-max range after changing day

    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate()
      ) {
        if (newListenValues.hour < props.minDate.getHours()) {
          while (newListenValues.hour < props.minDate.getHours()) {
            newListenValues.hour = newListenValues.hour + 1;

            if (newListenValues.hour == 23) break;
          }
        }
      }
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate()
      ) {
        if (newListenValues.hour > props.maxDate.getHours()) {
          while (newListenValues.hour > props.maxDate.getHours()) {
            newListenValues.hour = newListenValues.hour - 1;

            if (newListenValues.hour == 0) break;
          }
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate()
      ) {
        if (newListenValues.hour < props.minDate.getHours()) {
          while (newListenValues.hour < props.minDate.getHours()) {
            newListenValues.hour = newListenValues.hour + 1;

            if (newListenValues.hour == 23) break;
          }
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate()
      ) {
        if (newListenValues.hour > props.maxDate.getHours()) {
          while (newListenValues.hour > props.maxDate.getHours()) {
            newListenValues.hour = newListenValues.hour - 1;

            if (newListenValues.hour == 0) break;
          }
        }
      }
    }

    // maybe need to correct minute, because current selected minute may not be in min-max range after changing day and maybe also hour

    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        newListenValues.hour == props.minDate.getHours()
      ) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        newListenValues.hour == props.maxDate.getHours()
      ) {
        if (newListenValues.minute > props.maxDate.getMinutes()) {
          while (newListenValues.minute > props.maxDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute - 1;

            if (newListenValues.minute == 0) break;
          }
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        newListenValues.hour == props.minDate.getHours()
      ) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        newListenValues.hour == props.maxDate.getHours()
      ) {
        if (newListenValues.minute > props.maxDate.getMinutes()) {
          while (newListenValues.minute > props.maxDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute - 1;

            if (newListenValues.minute == 0) break;
          }
        }
      }
    }

    newDate.setHours(newListenValues.hour, newListenValues.minute, 0, 0);

    notify(newDate);
    // drawDays() - not needed, because changing date will automatically update component
  };

  const changeMinute: (minute: number) => void = (minute) => {
    const newListenValues: ListenValues = { ...listenValues, minute: minute };

    const selectedYear = props.value.getFullYear();
    const selectedMonth = props.value.getMonth();
    const selectedDay = props.value.getDate();

    const newDate = new Date(selectedYear, selectedMonth, selectedDay);

    newDate.setHours(newListenValues.hour, newListenValues.minute, 0, 0);

    notify(newDate);
    // drawDays() not needed, because info about days not changing
  };

  const changeHour: (hour: number) => void = (hour) => {
    const newListenValues: ListenValues = { ...listenValues, hour: hour };

    // maybe need to correct hour, because current selected minute may not be in min-max range after changing hour

    const selectedYear = props.value.getFullYear();
    const selectedMonth = props.value.getMonth();
    const selectedDay = props.value.getDate();

    if (props.minDate && props.maxDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        newListenValues.hour == props.minDate.getHours()
      ) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        newListenValues.hour == props.maxDate.getHours()
      ) {
        if (newListenValues.minute > props.maxDate.getMinutes()) {
          while (newListenValues.minute > props.maxDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute - 1;

            if (newListenValues.minute == 0) break;
          }
        }
      }
    }
    if (props.minDate) {
      if (
        props.minDate.getFullYear() == selectedYear &&
        props.minDate.getMonth() == selectedMonth &&
        selectedDay == props.minDate.getDate() &&
        newListenValues.hour == props.minDate.getHours()
      ) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
    }
    if (props.maxDate) {
      if (
        props.maxDate.getFullYear() == selectedYear &&
        props.maxDate.getMonth() == selectedMonth &&
        selectedDay == props.maxDate.getDate() &&
        newListenValues.hour == props.maxDate.getHours()
      ) {
        if (newListenValues.minute > props.maxDate.getMinutes()) {
          while (newListenValues.minute > props.maxDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute - 1;

            if (newListenValues.minute == 0) break;
          }
        }
      }
    }

    const newDate = new Date(selectedYear, selectedMonth, selectedDay);

    newDate.setHours(newListenValues.hour, newListenValues.minute, 0, 0);

    notify(newDate);
    // drawDays() not needed, because info about days not changing
  };

  const notify: (newDate: Date) => void = (newDate) => {
    setTimeout(() => {
      props.onChange(newDate);
    }, 10);
  };

  return (
    <div className={`max-w-min ${props.className !== undefined ? props.className : ''}`} ref={ref}>
      <div className="w-full flex flex-col justify-center items-center rounded-lg overflow-hidden ring-1 ring-gray-200 bg-white no-select">
        <div className="w-full flex flex-row justify-between items-center border-b-2">
          <div className="flex-grow">
            <select
              className="w-full border-0 focus:ring-0 font-semibold p-1"
              onChange={(event) => {
                const month = parseInt(event.target.value);

                changeMonth(month);
              }}
              value={listenValues.month}>
              {monthNames.map((month, index) => {
                return (
                  <option
                    key={month + '_month_' + index}
                    value={index + 1}
                    disabled={monthDisabled(index)}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-grow">
            <select
              className="w-full border-0 focus:ring-0 font-semibold p-1"
              onChange={(event) => {
                const year = parseInt(event.target.value);

                changeYear(year);
              }}
              value={listenValues.year}>
              {Array.from(Array(21).keys()).map((year, index) => {
                return (
                  <option
                    key={year + '_year_' + index}
                    value={year + props.value.getFullYear() - 1 - 10}
                    disabled={yearDisabled(year + props.value.getFullYear() - 1 - 10)}>
                    {year + props.value.getFullYear() - 1 - 10}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="w-full border-b-2">
          <table className="w-full" cellSpacing="0">
            <thead>
              <tr>
                {dayNames.map((dayName, index) => {
                  return (
                    <td key={dayName + '_dayname_' + index} className="border-b">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-sm font-semibold">{dayName}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dayCalculation.dayRows.map((row, rowIndex) => {
                return (
                  <tr key={row + '_dayrow_' + rowIndex} className="">
                    {dayCalculation.dayRows[rowIndex].map((day, index) => {
                      if (!day.isDay) {
                        return (
                          <td key={day.day + '_unknown_' + index}>
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg"></div>
                          </td>
                        );
                      } else {
                        return (
                          <td key={day.day + '_unknown_' + index}>
                            <button
                              onClick={() => {
                                const dayNumber = day.day;

                                changeDay(dayNumber);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                                day.disabled ? 'cursor-default' : ''
                              } ${
                                listenValues.year == props.value.getFullYear() &&
                                listenValues.month == props.value.getMonth() + 1 &&
                                day.day == props.value.getDate()
                                  ? 'bg-purple-700 text-white'
                                  : !day.disabled
                                    ? 'hover:ring-1 hover:ring-purple-500'
                                    : ''
                              }`}
                              disabled={day.disabled}>
                              {day.disabled && <span className="text-base">{day.day}</span>}
                              {!day.disabled && (
                                <span className="text-base font-semibold">{day.day}</span>
                              )}
                            </button>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex-grow">
            <select
              className="w-full border-0 focus:ring-0 font-semibold text-center p-1"
              onChange={(event) => {
                const hour = parseInt(event.target.value);

                changeHour(hour);
              }}
              value={listenValues.hour}>
              {Array.from(Array(24).keys()).map((hour, index) => {
                return (
                  <option key={hour + '_hour_' + index} value={hour} disabled={hourDisabled(hour)}>
                    {('' + hour).length == 2 ? '' + hour : '0' + hour}
                  </option>
                );
              })}
            </select>
          </div>
          <p className="px-2 font-semibold">:</p>
          <div className="flex-grow">
            <select
              className="w-full border-0 focus:ring-0 font-semibold text-center p-1"
              onChange={(event) => {
                const minute = parseInt(event.target.value);

                changeMinute(minute);
              }}
              value={listenValues.minute}>
              {Array.from(Array(60).keys()).map((minute, index) => {
                return (
                  <option
                    key={minute + '_minute_' + index}
                    value={minute}
                    disabled={minuteDisabled(minute)}>
                    {('' + minute).length == 2 ? '' + minute : '0' + minute}
                  </option>
                );
              })}
            </select>
          </div>
          <p className="px-2 text-base font-semibold">Uhr</p>
        </div>
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, DateTimePickerProps>(DateTimePicker);
