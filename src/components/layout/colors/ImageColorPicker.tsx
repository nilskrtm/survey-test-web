import React, { createRef, MouseEvent, useEffect, useState } from 'react';

type CanvasDimensions = {
  width: number;
  height: number;
};

type PickerCircleCoordinates = {
  x: number;
  y: number;
  size: number;
};

type ImageColorPickerProps = Pick<React.JSX.IntrinsicElements['div'], 'className'> & {
  imageUrl: string;
  onPickColor: (color: string) => void;
  useCacheBreak?: boolean;
};

const ImageColorPicker: (props: ImageColorPickerProps) => React.JSX.Element = (props) => {
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: 500,
    height: 500
  });
  const [pickerCircleCoordinates, setPickerCircleCoordinates] = useState<PickerCircleCoordinates>({
    x: -999999,
    y: 999999,
    size: 0
  });
  const [image, setImage] = useState<HTMLImageElement>();
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const canvas = createRef<HTMLCanvasElement>();

  useEffect(() => {
    drawImage();
  }, [props.imageUrl]);

  const getImageMeta: (url: string, callback: (width: number, height: number) => void) => void = (
    url,
    callback
  ) => {
    const image = new Image();

    image.onload = function () {
      callback(image.naturalWidth, image.naturalHeight);
    };

    if (props.useCacheBreak !== undefined && props.useCacheBreak) {
      image.src = url + '?cacheBreak=' + new Date().getTime();
    } else {
      image.src = url;
    }
  };

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

  const drawImage = (oldPickerCircleCoordinates?: PickerCircleCoordinates) => {
    if (canvas.current) {
      const canvasContext = canvas.current.getContext('2d');
      let payloadPickerCircleCoordinates: PickerCircleCoordinates = pickerCircleCoordinates;

      if (oldPickerCircleCoordinates) {
        payloadPickerCircleCoordinates = {
          ...pickerCircleCoordinates,
          ...oldPickerCircleCoordinates
        };
      } else {
        payloadPickerCircleCoordinates = pickerCircleCoordinates;
      }

      if (canvasContext) {
        canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);

        if (!image) {
          getImageMeta(props.imageUrl, (width, height) => {
            const newCanvasDimensions: CanvasDimensions = { width: width, height: height };
            const newPickerCircleCoordinates: PickerCircleCoordinates = {
              ...payloadPickerCircleCoordinates,
              x: width / 2 - payloadPickerCircleCoordinates.size / 2,
              y: height / 2 - payloadPickerCircleCoordinates.size / 2
            };

            const newImage = new Image(width, height);

            newImage.crossOrigin = 'Anonymous';
            newImage.onload = () => {
              canvasContext.drawImage(newImage, 0, 0, newImage.width, newImage.height);

              canvasContext.beginPath();
              canvasContext.arc(
                pickerCircleCoordinates.x,
                pickerCircleCoordinates.y,
                pickerCircleCoordinates.size,
                0,
                Math.PI * 2
              );
              canvasContext.strokeStyle = 'black';
              canvasContext.stroke();
              canvasContext.closePath();
            };
            if (props.useCacheBreak !== undefined && props.useCacheBreak) {
              newImage.src = props.imageUrl + '?cacheBreak=' + new Date().getTime();
            } else {
              newImage.src = props.imageUrl;
            }

            setCanvasDimensions(newCanvasDimensions);
            setPickerCircleCoordinates(newPickerCircleCoordinates);
            setImage(newImage);
          });
        } else {
          canvasContext.drawImage(image, 0, 0, image.width, image.height);

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

        drawImage({
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
      width={canvasDimensions.width}
      height={canvasDimensions.height}
    />
  );
};

export default ImageColorPicker;
