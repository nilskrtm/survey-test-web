import React, { ChangeEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type AuthenticationInputProps = {
  autoComplete?: string;
  autoFocus?: boolean;
  icon?: IconProp;
  id?: string;
  label: string;
  onChange?: ChangeEventHandler;
  placeholder?: string;
  type:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
  validationMessage?: string;
  value?: string;
};

const AuthenticationInput: (props: AuthenticationInputProps) => React.JSX.Element = (props) => {
  const id = props.id ? props.id : Math.random().toString(36).substring(2, 12);

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="py-2 font-medium" onClick={(event) => event.preventDefault()}>
        {props.label}
      </label>
      {props.icon ? (
        <div className="relative">
          <input
            autoComplete={props.autoComplete}
            autoFocus={props.autoFocus}
            id={id}
            type={props.type}
            onChange={props.onChange}
            placeholder={props.placeholder}
            value={props.value}
            className="form-input w-full h-11 pr-12 rounded-md font-normal text-md text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
          />
          <FontAwesomeIcon
            icon={props.icon}
            size="lg"
            className="absolute right-5 top-3 text-black pointer-events-none"
          />
        </div>
      ) : (
        <input
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          id={id}
          type={props.type}
          onChange={props.onChange}
          placeholder={props.placeholder}
          value={props.value}
          className="form-input w-full h-11 rounded-md font-normal text-md text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
        />
      )}
      <p className="p-1 pt-2 text-sm text-red-500 font-medium">{props.validationMessage}</p>
    </div>
  );
};

export default AuthenticationInput;
