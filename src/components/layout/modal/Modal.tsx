import React, { createRef, LegacyRef, PropsWithChildren, RefObject } from 'react';
import useClickOutside from '../../../utils/hooks/use.click.outside.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useGroupClickOutside from '../../../utils/hooks/use.group.click.outside.hook';

export type ModalProps = Pick<React.JSX.IntrinsicElements['div'], 'className'> & {
  childModals?: RefObject<HTMLDivElement>[];
  closeable?: boolean;
  containerRef?: LegacyRef<HTMLDivElement>;
  onRequestClose?: () => void;
  title: string;
  visible?: boolean;
};

const Modal: (props: PropsWithChildren<ModalProps>) => React.JSX.Element = (props) => {
  const backgroundOverlayRef = createRef<HTMLDivElement>();

  if (props.childModals !== undefined) {
    useGroupClickOutside([...props.childModals, backgroundOverlayRef], () => {
      if (props.onRequestClose) {
        props.onRequestClose();
      }
    });
  } else {
    useClickOutside(backgroundOverlayRef, () => {
      if (props.onRequestClose) {
        props.onRequestClose();
      }
    });
  }

  return (
    <>
      {!!props.visible && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 z-30 h-full w-full flex items-center justify-center bg-slate-200/50"
          ref={props.containerRef}>
          <div
            className={`modal max-h-[95vh] rounded-lg border border-gray-300 bg-white ${
              props.className ? props.className : ''
            }`}
            ref={backgroundOverlayRef}>
            <div className="flex-grow flex flex-row items-center justify-between px-4 md:py-1">
              <span className="text-nowrap text-xl font-semibold truncate">{props.title}</span>
              <button
                disabled={props.closeable != undefined ? !props.closeable : false}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-2xl focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                  props.closeable != undefined ? (props.closeable ? '' : 'pointer-events-none') : ''
                }`}
                onClick={props.onRequestClose}
                title="Schließen"
                type="button">
                <FontAwesomeIcon icon={faXmark} size="1x" className="text-red-500" fixedWidth />
              </button>
            </div>
            <hr className="h-0.5 flex-grow border-none bg-gray-300" />
            <div className="flex-grow max-h-[calc(95vh-50px)] px-4 py-3 select-text">
              {props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
