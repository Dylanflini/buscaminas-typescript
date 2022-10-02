export enum GetQueryParamsErrorMessages {
  NOT_URL = 'must provide url',
  NOT_VALID_URL = 'must provided a relative url',
  NOT_CONTAIN_QUERY_PARAMS = 'must contain query param',
}

export class GetQueryParamsError extends Error {
  constructor(public readonly message: GetQueryParamsErrorMessages) {
    super();
  }
}

export const getSearchParams = (url: string | undefined): URLSearchParams => {
  const { NOT_URL, NOT_VALID_URL, NOT_CONTAIN_QUERY_PARAMS } = GetQueryParamsErrorMessages;

  if (!url) throw new GetQueryParamsError(NOT_URL);
  if (!/^\//.test(url)) throw new GetQueryParamsError(NOT_VALID_URL);

  const queryParams = url.split('?')[1];

  if (!queryParams) throw new GetQueryParamsError(NOT_CONTAIN_QUERY_PARAMS);

  return new URLSearchParams(url.split('?')[1]);
};
