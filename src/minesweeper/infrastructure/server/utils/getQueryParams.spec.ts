import {
  getSearchParams,
  GetQueryParamsError,
  GetQueryParamsErrorMessages,
} from './getQueryParams';

describe('get Query Params', () => {
  const { NOT_URL, NOT_VALID_URL, NOT_CONTAIN_QUERY_PARAMS } = GetQueryParamsErrorMessages;

  it('should throw error if url is not provided', () => {
    expect(() => getSearchParams(undefined)).toThrowError(new GetQueryParamsError(NOT_URL));
  });

  it.each([['http://domain.com/url'], ['url']])(
    'should throw error if param is not a valid url - test n %#',
    url => {
      expect(() => getSearchParams(url)).toThrowError(new GetQueryParamsError(NOT_VALID_URL));
    },
  );

  it('should throw error if url not contain some query param', () => {
    expect(() => getSearchParams('/pathname')).toThrowError(
      new GetQueryParamsError(NOT_CONTAIN_QUERY_PARAMS),
    );
  });

  it('should return URL Search Params instance', () => {
    const param1 = 'hola';
    const param2 = 'como-estas';

    const params = {
      param1,
      param2,
    };

    const searchParams = new URLSearchParams(params);

    const result = getSearchParams('/url?' + String(searchParams));

    expect(result.get('param1')).toBe(param1);
    expect(result.get('param2')).toBe(param2);
  });
});
