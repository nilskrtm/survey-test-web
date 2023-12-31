import { QuerySearchParams } from '../hooks/use.query.params';

type ParsedQuerySearchParams<V> = { [P in keyof V]: V[P] };

const parseQuerySearchParams: <T>(queryParams: QuerySearchParams) => ParsedQuerySearchParams<T> = (
  queryParams: QuerySearchParams
) => {
  const result: { [key: string]: string | number } = {};

  for (const param in queryParams) {
    result[param] = queryParams[param];
  }

  return result as ParsedQuerySearchParams<never>;
};

export { parseQuerySearchParams };
