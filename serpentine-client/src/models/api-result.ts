class ApiResult<T> {
  constructor(
    public statusCode: number = 404,
    public message: string = "Bad Request",
    public errors: string[] = [],
    public isSuccess: boolean = false,
    public data: T | null = null
  ) {}
}

export default ApiResult;