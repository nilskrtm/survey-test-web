import { useState } from 'react';

export enum LoadingOption {
  RESET = 0,
  LOADING = 1,
  LOADING_SILENT = 2,
  ERROR = 3
}

type LoadingState = {
  loading: boolean;
  loadingSilent: boolean;
  error: boolean;
  set: (state: LoadingOption) => void;
};

type LoadingStateInternal = Pick<LoadingState, 'loading' | 'loadingSilent' | 'error'>;

const useLoader: () => LoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingStateInternal>({
    loading: false,
    loadingSilent: false,
    error: false
  });

  const setLoadingStateInternal = (option: LoadingOption) => {
    if (option === LoadingOption.RESET) {
      const merge: LoadingStateInternal = {
        loading: false,
        loadingSilent: false,
        error: false
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    } else if (option === LoadingOption.LOADING) {
      const merge: LoadingStateInternal = {
        loading: true,
        loadingSilent: false,
        error: false
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    } else if (option === LoadingOption.LOADING_SILENT) {
      const merge: LoadingStateInternal = {
        loading: true,
        loadingSilent: true,
        error: false
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    } else if (option === LoadingOption.ERROR) {
      const merge: LoadingStateInternal = {
        loading: false,
        loadingSilent: false,
        error: true
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    }
  };

  return {
    ...loadingState,
    set: setLoadingStateInternal
  };
};

export default useLoader;
