import React, { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';

type TimePickerProps = Pick<React.JSX.IntrinsicElements['div'], 'className'> & {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
};

type ListenValues = {
  hour: number;
  minute: number;
};

const TimePicker: ForwardRefRenderFunction<HTMLDivElement, TimePickerProps> = (props, ref) => {
  const [listenValues, setListenValues] = useState<ListenValues>({
    hour: 0,
    minute: 0
  });

  useEffect(() => {
    newDateInput();
  }, [props.value, props.minDate, props.maxDate]);

  const newDateInput = () => {
    setListenValues({
      hour: props.value.getHours(),
      minute: props.value.getMinutes()
    });
  };

  const hourDisabled: (hour: number) => boolean = (hour) => {
    if (props.minDate && props.maxDate) {
      if (hour < props.minDate.getHours()) {
        return true;
      }
      if (hour > props.maxDate.getHours()) {
        return true;
      }
    }
    if (props.minDate) {
      if (hour < props.minDate.getHours()) {
        return true;
      }
    }
    if (props.maxDate) {
      if (hour > props.maxDate.getHours()) {
        return true;
      }
    }

    return false;
  };

  const minuteDisabled: (minute: number) => boolean = (minute) => {
    if (props.minDate && props.maxDate) {
      if (listenValues.hour == props.minDate.getHours()) {
        if (minute < props.minDate.getMinutes()) {
          return true;
        }
      }
      if (listenValues.hour == props.maxDate.getHours()) {
        if (minute > props.maxDate.getMinutes()) {
          return true;
        }
      }
    }
    if (props.minDate) {
      if (listenValues.hour == props.minDate.getHours()) {
        if (minute < props.minDate.getMinutes()) {
          return true;
        }
      }
    }
    if (props.maxDate) {
      if (listenValues.hour == props.maxDate.getHours()) {
        if (minute > props.maxDate.getMinutes()) {
          return true;
        }
      }
    }

    return false;
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
      if (newListenValues.hour == props.minDate.getHours()) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
      if (newListenValues.hour == props.maxDate.getHours()) {
        if (newListenValues.minute > props.maxDate.getMinutes()) {
          while (newListenValues.minute > props.maxDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute - 1;

            if (newListenValues.minute == 0) break;
          }
        }
      }
    }
    if (props.minDate) {
      if (newListenValues.hour == props.minDate.getHours()) {
        if (newListenValues.minute < props.minDate.getMinutes()) {
          while (newListenValues.minute < props.minDate.getMinutes()) {
            newListenValues.minute = newListenValues.minute + 1;

            if (newListenValues.minute == 59) break;
          }
        }
      }
    }
    if (props.maxDate) {
      if (newListenValues.hour == props.maxDate.getHours()) {
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
  };

  const notify: (newDate: Date) => void = (newDate) => {
    setTimeout(() => {
      props.onChange(newDate);
    }, 10);
  };

  return (
    <div className={`max-w-min ${props.className !== undefined ? props.className : ''}`} ref={ref}>
      <div className="min-w-52 w-full flex flex-col justify-center items-center rounded-lg overflow-hidden ring-1 ring-gray-200 bg-white no-select">
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

export default forwardRef<HTMLDivElement, TimePickerProps>(TimePicker);
