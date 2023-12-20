import React, { MouseEventHandler, PropsWithChildren } from 'react';

type AuthenticationButtonProps = {
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  id?: string;
  loading?: boolean;
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit' | 'reset';
};

const AuthenticationButton: (
  props: PropsWithChildren<AuthenticationButtonProps>
) => React.JSX.Element = (props: PropsWithChildren<AuthenticationButtonProps>) => {
  const id = props.id ? props.id : Math.random().toString(36).substring(2, 12);

  return (
    <div className={`px-2 ${props.containerClassName}`}>
      <button
        disabled={props.disabled ? props.disabled : false}
        id={id}
        type={props.type}
        onClick={props.onClick}
        className={`px-3 py-2 form-input rounded-md bg-blue-950 text-sm text-white font-semibold uppercase focus:border-blue-950 focus:border-opacity-30 ${
          props.className
        } ${props.loading ? ' loading-authentication-button' : ''}`}>
        {props.children}
      </button>
    </div>
  );
};

export default AuthenticationButton;
