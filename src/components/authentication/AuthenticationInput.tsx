import React, { ChangeEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type AuthenticationInputProps = {
  autoComplete?: string;
  icon?: IconProp;
  id?: string;
  label: string;
  onChange?: ChangeEventHandler;
  placeholder?: string;
  type: string;
  validationMessage?: string;
  value?: string;
};

const AuthenticationInput: (props: AuthenticationInputProps) => React.JSX.Element = (
  props: AuthenticationInputProps
) => {
  const id = props.id ? props.id : Math.random().toString(36).substring(2, 12);

  return (
    <div className="flex flex-col px-2">
      <label htmlFor={id} className="px-1 py-2 font-bold" onClick={(e) => e.preventDefault()}>
        {props.label}
      </label>
      {props.icon ? (
        <div className="relative">
          <input
            autoComplete={props.autoComplete}
            id={id}
            type={props.type}
            onChange={props.onChange}
            placeholder={props.placeholder}
            value={props.value}
            className="w-full h-11 pr-12 form-input rounded-md focus:border-blue-950"
          />
          <FontAwesomeIcon icon={props.icon} size="lg" className="absolute right-5 top-3" />
        </div>
      ) : (
        <input
          autoComplete={props.autoComplete}
          id={id}
          type={props.type}
          onChange={props.onChange}
          placeholder={props.placeholder}
          value={props.value}
          className="w-full h-11 form-input rounded-md focus:border-blue-950"
        />
      )}
      <p className="p-1 pt-2 text-sm text-red-500 font-medium">{props.validationMessage}</p>
    </div>
  );
};

export default AuthenticationInput;
