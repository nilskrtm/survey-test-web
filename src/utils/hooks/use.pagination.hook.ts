import { useEffect, useState } from 'react';
import { ComputedPagingData, Pagination, PagingData } from '../interfaces/pagination.interface';
import { APIPaging } from '../../data/types/common.types';

const usePagination: (requestPerPage: number) => Pagination = (perPage: number) => {
  const [data, setData] = useState<PagingData>({
    perPage: perPage,
    page: 1,
    lastPage: 1,
    pageCount: 0,
    count: 0
  });
  const [computedData, setComputedData] = useState<ComputedPagingData>({
    firstElementNumber: 0,
    lastElementNumber: 0
  });

  useEffect(() => {
    let firstElementNumber = data.page * data.perPage - data.perPage;

    if (data.pageCount > 0) {
      firstElementNumber++;
    }

    let lastElementNumber;

    if (data.pageCount % data.perPage === 0) {
      if (data.pageCount == 0) {
        lastElementNumber = 0;
      } else {
        lastElementNumber = data.page * data.perPage;
      }
    } else {
      lastElementNumber =
        data.page * data.perPage - Math.abs((data.pageCount % data.perPage) - data.perPage);
    }

    setComputedData({
      firstElementNumber: firstElementNumber,
      lastElementNumber: lastElementNumber
    });
  }, [data]);

  const pagination: Pagination = {
    ...data,
    ...computedData,
    update: (newPagingData: APIPaging, pageCount: number) => {
      const fullPagingData: PagingData = { ...newPagingData, pageCount: pageCount };

      setData(fullPagingData);

      return fullPagingData;
    },
    reset: () => {
      setData({
        perPage: perPage,
        page: 1,
        lastPage: 1,
        pageCount: 0,
        count: 0
      });
    }
  };

  return pagination;
};

export default usePagination;
