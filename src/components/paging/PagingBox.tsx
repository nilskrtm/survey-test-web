import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '../../utils/interfaces/pagination.interface';

type PagingBoxProps = {
  pagination: Pagination;
  openPage: (number: number) => void;
};

const PagingBox: (props: PagingBoxProps) => React.JSX.Element = (props) => {
  const clickFirstPage: () => void = () => {
    props.openPage(1);
  };

  const clickLastPage: () => void = () => {
    props.openPage(props.pagination.lastPage);
  };

  const clickPreviousPage: () => void = () => {
    props.openPage(props.pagination.page - 1);
  };

  const clickNextPage: () => void = () => {
    props.openPage(props.pagination.page + 1);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center rounded-lg bg-white border border-gray-200 py-4 px-10 select-none">
      <button
        className="flex flex-row items-center justify-center p-2 text-gray-700 enabled:hover:!text-purple-700 disabled:cursor-not-allowed"
        title="Erste Seite"
        onClick={clickFirstPage}
        disabled={props.pagination.page === 1}>
        <FontAwesomeIcon
          icon={faAnglesLeft}
          size="2x"
          fixedWidth={true}
          className="text-2xl text-inherit"
        />
      </button>
      <button
        className="flex flex-row items-center justify-center p-2 text-gray-700 enabled:hover:!text-purple-700 disabled:cursor-not-allowed"
        title="Vorherige Seite"
        onClick={clickPreviousPage}
        disabled={props.pagination.page === 1}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          size="2x"
          fixedWidth={true}
          className="text-2xl text-inherit"
        />
      </button>
      <p className="text-lg text-black font-medium px-6">
        Seite {props.pagination.page} von {props.pagination.lastPage}
      </p>
      <button
        className="flex flex-row items-center justify-center p-2 text-gray-700 enabled:hover:!text-purple-700 disabled:cursor-not-allowed"
        title="Nächste Seite"
        onClick={clickNextPage}
        disabled={props.pagination.page === props.pagination.lastPage}>
        <FontAwesomeIcon
          icon={faAngleRight}
          size="2x"
          fixedWidth={true}
          className="text-2xl text-inherit"
        />
      </button>
      <button
        className="flex flex-row items-center justify-center p-2 text-gray-700 enabled:hover:!text-purple-700 disabled:cursor-not-allowed"
        title="Letzte Seite"
        onClick={clickLastPage}
        disabled={props.pagination.page === props.pagination.lastPage}>
        <FontAwesomeIcon
          icon={faAnglesRight}
          size="2x"
          fixedWidth={true}
          className="text-2xl text-inherit"
        />
      </button>
    </div>
  );
};

export default PagingBox;
