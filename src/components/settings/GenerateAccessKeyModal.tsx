import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import Modal from '../layout/modal/Modal';

type GenerateAccessKeyModalProps = {
  onConfirmGeneration: () => void;
};

export type GenerateAccessKeyModalRefAttributes = {
  open: () => void;
};

const GenerateAccessKeyModal: ForwardRefRenderFunction<
  GenerateAccessKeyModalRefAttributes,
  GenerateAccessKeyModalProps
> = (props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle<GenerateAccessKeyModalRefAttributes, GenerateAccessKeyModalRefAttributes>(
    ref,
    () => ({
      open: () => {
        if (!visible) {
          setVisible(true);
        }
      }
    }),
    [visible]
  );

  const onClose = () => {
    if (visible) {
      setVisible(false);
    }
  };

  return (
    <Modal
      closeable={true}
      onRequestClose={onClose}
      title="Zugangsschlüssel generieren"
      visible={visible}>
      <div className="flex flex-col items-start justify-center">
        <span className="text-base font-normal truncate whitespace-break-spaces">
          Durch das Neu-Generieren des Zugangsschlüssels wird es nötig, diesen ebenfalls in den
          Einstellungen in Ihren Geräten anzupassen. Bis dahin wird es nicht möglich sein, dass
          Geräte welche noch den alten Zugangsschlüssel hinterlegt haben Daten mit dem Server
          synchronisieren können.
        </span>
        <div className="w-full flex flex-row items-center justify-end mt-4">
          <button
            className="px-3 py-[8px] rounded-md text-base text-white font-medium bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => {
              onClose();
              props.onConfirmGeneration();
            }}
            title="Zugangsschlüssel neu Generieren">
            Neu Generieren
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef<GenerateAccessKeyModalRefAttributes, GenerateAccessKeyModalProps>(
  GenerateAccessKeyModal
);
