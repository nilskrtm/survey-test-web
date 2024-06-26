import React, { LegacyRef, useEffect, useRef } from 'react';
import ReactContentEditable, {
  ContentEditableEvent,
  type Props as ReactContentEditableProps
} from 'react-contenteditable';

type RawContentEditableProps = Pick<
  ReactContentEditableProps,
  Exclude<keyof ReactContentEditableProps, keyof { ref: any }>
> & {
  ref?: LegacyRef<any>;
};

type DivProps = Pick<
  React.JSX.IntrinsicElements['div'],
  Exclude<keyof React.JSX.IntrinsicElements['div'], keyof { onChange: any; ref: any }>
> & {
  ref?: LegacyRef<typeof ContentEditable>;
};

interface ContentEditableProps
  extends Pick<ReactContentEditableProps, 'disabled' | 'html' | 'innerRef' | 'tagName'>,
    DivProps {
  maxLength?: number;
  onChange?: (event: ContentEditableEvent) => void;
  preventLinebreak?: boolean;
  preventPaste?: boolean;
}

const linebreakRegex = /(\r\n|\n|\r)/gm;

const ContentEditable: (props: ContentEditableProps) => React.JSX.Element = ({
  onChange,
  onInput,
  onBlur,
  onKeyPress,
  onKeyDown,
  onPaste,
  maxLength,
  preventLinebreak,
  preventPaste,
  ...props
}) => {
  const onChangeRef = useRef(onChange);
  const onInputRef = useRef(onInput);
  const onBlurRef = useRef(onBlur);
  const onKeyPressRef = useRef(onKeyPress);
  const onKeyDownRef = useRef(onKeyDown);
  const onPasteRef = useRef(onPaste);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);

  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  useEffect(() => {
    onKeyPressRef.current = onKeyPress;
  }, [onKeyPress]);

  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  useEffect(() => {
    onPasteRef.current = onPaste;
  }, [onPaste]);

  return (
    <ReactContentEditable
      {...(props as RawContentEditableProps)}
      onChange={
        onChange
          ? (...args) => {
              if (preventLinebreak === true) {
                args.forEach((event) => {
                  event.target.value = event.target.value.replace(linebreakRegex, '');
                });
              }

              if (onChangeRef.current) {
                onChangeRef.current(...args);
              }
            }
          : (...args) => {
              if (preventLinebreak === true) {
                args.forEach((event) => {
                  event.target.value = event.target.value.replace(linebreakRegex, '');
                });
              }
            }
      }
      onInput={
        onInput
          ? (...args) => {
              if (onInputRef.current) {
                onInputRef.current(...args);
              }
            }
          : undefined
      }
      onBlur={
        onBlur
          ? (...args) => {
              if (onBlurRef.current) {
                onBlurRef.current(...args);
              }
            }
          : undefined
      }
      onKeyPress={
        onKeyPress
          ? (...args) => {
              if (onKeyPressRef.current) {
                onKeyPressRef.current(...args);
              }
            }
          : undefined
      }
      onPaste={
        onPaste
          ? (...args) => {
              if (preventPaste === true) {
                args.forEach((event) => {
                  event.preventDefault();
                });
              }

              if (onPasteRef.current) {
                onPasteRef.current(...args);
              }
            }
          : (...args) => {
              if (preventPaste === true) {
                args.forEach((event) => {
                  event.preventDefault();
                });
              }
            }
      }
      onKeyDown={
        onKeyDown
          ? (...args) => {
              if (preventLinebreak === true) {
                args.forEach((event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                });
              }

              if (maxLength !== undefined) {
                args.forEach((event) => {
                  if (
                    (event.target as HTMLDivElement).innerHTML.length >= maxLength &&
                    event.key !== 'Backspace'
                  ) {
                    event.preventDefault();
                  }
                });
              }

              if (onKeyDownRef.current) {
                onKeyDownRef.current(...args);
              }
            }
          : (...args) => {
              if (preventLinebreak === true) {
                args.forEach((event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                });
              }
            }
      }
    />
  );
};

export default ContentEditable;
