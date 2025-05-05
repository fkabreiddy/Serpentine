class ApiResult<T> {
  constructor(
    public statusCode: number = 200,
    public message: string = "Ok",
    public errors: string[] = [],
    public data: T | null = null
  ) {}
}

export default ApiResult;