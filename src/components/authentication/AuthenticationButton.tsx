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
    <div className={`${props.containerClassName}`}>
      <button
        disabled={props.disabled ? props.disabled : false}
        id={id}
        type={props.type}
        onClick={props.onClick}
        className={`px-3 py-[8px] rounded-md bg-purple-800 text-sm text-white font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          props.className
        } ${props.loading ? ' loading-authentication-button' : ''}`}>
        {props.children}
      </button>
    </div>
  );
};

export default AuthenticationButton;
