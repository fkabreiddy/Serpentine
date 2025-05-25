class ApiResult<T> {
  constructor(
    public statusCode: number = 404,
    public message: string = "Bad Request",
    public errors: string[] = [],
    public isSuccess: boolean = false,
    public data: T | null = null
  ) {}
}

export interface HookState<T> {
    loading: boolean;
    data: ApiResult<T>;
}


export default ApiResult;