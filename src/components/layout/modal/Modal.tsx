import React, { createRef, PropsWithChildren } from 'react';
import useClickOutside from '../../../utils/hooks/use.click.outside';

type ModalProps = {
  onClickOutside?: () => void;
  visible?: boolean;
};

const Modal: (props: PropsWithChildren<ModalProps>) => React.JSX.Element = (props) => {
  const backgroundOverlayRef = createRef<HTMLDivElement>();

  useClickOutside(backgroundOverlayRef, () => {
    if (props.onClickOutside) {
      props.onClickOutside();
    }
  });

  return (
    <>
      {!!props.visible && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 h-full w-full flex items-center justify-center bg-slate-200/60">
          <div className="" ref={backgroundOverlayRef}>
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
