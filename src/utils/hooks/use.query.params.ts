import { useEffect, useState } from 'react';
import { NavigateOptions, URLSearchParamsInit, useSearchParams } from 'react-router-dom';

type QuerySearchParams = { [key: string]: string };

type QuerySearchParamsInit = QuerySearchParams;

type SetQuerySearchParams = (
  nextInit?: QuerySearchParamsInit | ((prev: QuerySearchParams) => QuerySearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

const useQueryParams: (
  defaultInit?: QuerySearchParamsInit
) => [QuerySearchParams, SetQuerySearchParams] = (defaultInit?: QuerySearchParamsInit) => {
  let initialSearchParams: URLSearchParamsInit | undefined;

  if (defaultInit) {
    initialSearchParams = new URLSearchParams();

    for (const key in defaultInit) {
      initialSearchParams.append(key, defaultInit[key]);
    }
  }

  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [queryParams, setInternalQueryParams] = useState<QuerySearchParams>({});

  useEffect(() => {
    const searchParamsArray: [string, string][] = Array.from(searchParams);
    const newQueryParams: QuerySearchParams = {};

    searchParamsArray.forEach(([key, value]) => {
      newQueryParams[key] = value;
    });

    setInternalQueryParams(newQueryParams);
  }, [searchParams]);

  const setQueryParams: SetQuerySearchParams = (
    nextInit?: QuerySearchParamsInit | ((prev: QuerySearchParams) => QuerySearchParamsInit),
    navigateOpts?: NavigateOptions
  ) => {
    let queryParamsDict: QuerySearchParamsInit;

    if (nextInit) {
      if (nextInit instanceof Function) {
        queryParamsDict = nextInit(queryParams);
      } else {
        queryParamsDict = nextInit;
      }

      const newSearchParams: URLSearchParams = new URLSearchParams();

      for (const key in queryParamsDict) {
        newSearchParams.append(key, queryParamsDict[key]);
      }

      if (navigateOpts) {
        setSearchParams(newSearchParams, navigateOpts);
      } else {
        setSearchParams(newSearchParams);
      }
    }
  };

  return [queryParams, setQueryParams];
};

export default useQueryParams;
