import React, { PropsWithChildren } from 'react';

type ModalProps = {
  size: 'small' | 'large';
};

const Modal: (props: PropsWithChildren<ModalProps>) => React.JSX.Element = (
  props: PropsWithChildren<ModalProps>
) => {
  return <div></div>;
};

export default Modal;
