import React from 'react';
import { BounceLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

type ChartPlaceholderProps = {
  loading: boolean;
  error: boolean;
  height: string;
};

const ChartPlaceholder: (props: ChartPlaceholderProps) => React.JSX.Element = (props) => {
  if (!props.loading && !props.error) return <></>;

  return (
    <div
      className="w-full flex flex-col items-center justify-center space-y-4"
      style={{ height: props.height }}>
      {props.loading ? (
        <BounceLoader color="rgb(126 34 206)" size={70} />
      ) : (
        <>
          <FontAwesomeIcon icon={faExclamation} size="1x" className="text-3xl text-red-500" />
          <p className="text-medium font-medium text-gray-700">Abruf der Daten fehlgeschlagen</p>
        </>
      )}
    </div>
  );
};

export default ChartPlaceholder;
