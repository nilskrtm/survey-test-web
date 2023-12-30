import { APIPaging } from '../../data/types/common.types';

export type PagingData = APIPaging & {
  pageCount: number;
};

export type ComputedPagingData = {
  firstElementNumber: number;
  lastElementNumber: number;
};

export interface Pagination extends PagingData, ComputedPagingData {
  update: (newPagingData: APIPaging, pageCount: number) => PagingData;
}
