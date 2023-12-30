import { useState } from 'react';

export enum LoadingOption {
  RESET = 0,
  LOADING = 1,
  ERROR = 2
}

type LoadingState = {
  loading: boolean;
  error: boolean;
  set: (state: LoadingOption) => void;
};

const useLoading: () => LoadingState = () => {
  const [loadingState, setLoadingState] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false
  });

  const setLoadingStateInternal = (option: LoadingOption) => {
    if (option === LoadingOption.RESET) {
      const merge: Partial<LoadingState> = {
        loading: false,
        error: false
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    } else if (option === LoadingOption.LOADING) {
      const merge: Partial<LoadingState> = {
        loading: true,
        error: false
      };

      setLoadingState((state) => ({
        ...state,
        ...merge
      }));
    } else if (option === LoadingOption.ERROR) {
      const merge: Partial<LoadingState> = {
        loading: false,
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

export default useLoading;
