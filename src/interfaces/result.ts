export interface IResult<T> {
  data: T;
  isSuccess: boolean;
  code: number;
}
