class ApiResult<T> {
  constructor(
    public statusCode: number = 404,
    public resultTitle: string = "Ouch!",
    public message: string = "Something went wrong",
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