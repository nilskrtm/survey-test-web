import React, { createRef, MouseEvent, useEffect, useState } from 'react';

type PickerCircleCoordinates = {
  x: number;
  y: number;
  size: number;
};

type ColorPickerProps = Pick<React.JSX.IntrinsicElements['div'], 'className'> & {
  onPickColor: (color: string) => void;
};

const ColorPicker: (props: ColorPickerProps) => React.JSX.Element = (props) => {
  const [pickerCircleCoordinates, setPickerCircleCoordinates] = useState<PickerCircleCoordinates>({
    x: -999999,
    y: 999999,
    size: 0
  });
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const canvas = createRef<HTMLCanvasElement>();

  useEffect(() => {
    drawColorField();
  }, []);

  const recalculatePickerSize: (
    oldPickerCircleCoordinates: PickerCircleCoordinates
  ) => PickerCircleCoordinates = (oldPickerCircleCoordinates) => {
    if (canvas.current) {
      return {
        ...pickerCircleCoordinates,
        ...oldPickerCircleCoordinates,
        size: (canvas.current.width / canvas.current.clientWidth) * 10
      };
    }

    return { ...pickerCircleCoordinates, oldPickerCircleCoordinates };
  };

  const drawColorField = (oldPickerCircleCoordinates?: PickerCircleCoordinates) => {
    if (canvas.current) {
      const canvasContext = canvas.current.getContext('2d');
      let payloadPickerCircleCoordinates: PickerCircleCoordinates;

      if (oldPickerCircleCoordinates) {
        payloadPickerCircleCoordinates = {
          ...pickerCircleCoordinates,
          ...oldPickerCircleCoordinates
        };
      } else {
        payloadPickerCircleCoordinates = pickerCircleCoordinates;
      }

      if (canvasContext) {
        let gradient = canvasContext.createLinearGradient(0, 0, canvas.current.width, 0);

        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(1 / 6, '#ffff00');
        gradient.addColorStop((1 / 6) * 2, '#00ff00');
        gradient.addColorStop((1 / 6) * 3, '#00ffff');
        gradient.addColorStop((1 / 6) * 4, '#0000ff');
        gradient.addColorStop((1 / 6) * 5, '#ff00ff');
        gradient.addColorStop(1, '#ff0000');
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, canvas.current.width, canvas.current.height);

        gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.current.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, canvas.current.width, canvas.current.height);

        gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.current.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, canvas.current.width, canvas.current.height);

        const newPickerCircleCoordinates: PickerCircleCoordinates = recalculatePickerSize(
          payloadPickerCircleCoordinates
        );

        canvasContext.beginPath();
        canvasContext.arc(
          newPickerCircleCoordinates.x,
          newPickerCircleCoordinates.y,
          newPickerCircleCoordinates.size,
          0,
          Math.PI * 2,
          false
        ); // outer (filled)
        canvasContext.arc(
          newPickerCircleCoordinates.x,
          newPickerCircleCoordinates.y,
          newPickerCircleCoordinates.size / 2,
          0,
          Math.PI * 2,
          true
        ); // outer (unfills it)
        canvasContext.fillStyle = 'white';
        canvasContext.fill();
        canvasContext.strokeStyle = 'white';
        canvasContext.stroke();
        canvasContext.closePath();

        setPickerCircleCoordinates(newPickerCircleCoordinates);
      }
    }
  };

  const rgba2hex: (rgb: string) => string = (rgb) => {
    const rgbMatches = rgb.match(
      /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
    );

    return rgbMatches && rgbMatches.length === 4
      ? '#' +
          ('0' + parseInt(rgbMatches[1], 10).toString(16)).slice(-2) +
          ('0' + parseInt(rgbMatches[2], 10).toString(16)).slice(-2) +
          ('0' + parseInt(rgbMatches[3], 10).toString(16)).slice(-2)
      : '';
  };

  const onMouseMove: (event: MouseEvent<HTMLCanvasElement>) => void = (event) => {
    if (canvas.current) {
      const canvasContext = canvas.current.getContext('2d');

      if (canvasContext) {
        const imgData = canvasContext.getImageData(
          (event.nativeEvent.offsetX / canvas.current.clientWidth) * canvas.current.width,
          (event.nativeEvent.offsetY / canvas.current.clientHeight) * canvas.current.height,
          1,
          1
        );
        const rgba = imgData.data;
        const colorRGBA =
          'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + rgba[3] + ')';

        if (mouseDown) {
          props.onPickColor(rgba2hex(colorRGBA));
        }

        drawColorField({
          ...pickerCircleCoordinates,
          x: (event.nativeEvent.offsetX / canvas.current.clientWidth) * canvas.current.width,
          y: (event.nativeEvent.offsetY / canvas.current.clientHeight) * canvas.current.height
        });
      }
    }
  };

  const onClick: (event: MouseEvent<HTMLCanvasElement>) => void = (event) => {
    if (canvas.current) {
      const canvasContext = canvas.current.getContext('2d');

      if (canvasContext) {
        const imgData = canvasContext.getImageData(
          (event.nativeEvent.offsetX / canvas.current.clientWidth) * canvas.current.width,
          (event.nativeEvent.offsetY / canvas.current.clientHeight) * canvas.current.height,
          1,
          1
        );
        const rgba = imgData.data;
        const colorRGBA =
          'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + rgba[3] + ')';

        props.onPickColor(rgba2hex(colorRGBA));

        drawImage({
          ...pickerCircleCoordinates,
          x: (event.nativeEvent.offsetX / canvas.current.clientWidth) * canvas.current.width,
          y: (event.nativeEvent.offsetY / canvas.current.clientHeight) * canvas.current.height
        });
      }
    }
  };

  return (
    <canvas
      className={props.className}
      ref={canvas}
      onMouseDown={() => {
        setMouseDown(true);
      }}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      onMouseMove={onMouseMove}
      onClick={onClick}
      width={500}
      height={500}
    />
  );
};

export default ColorPicker;
