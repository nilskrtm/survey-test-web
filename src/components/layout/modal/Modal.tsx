import React, { PropsWithChildren } from 'react';

type ModalProps = {
  size: 'small' | 'large';
};

const Modal: (props: PropsWithChildren<ModalProps>) => React.JSX.Element = (props) => {
  return <div></div>;
};

export default Modal;
