export class HubResult<T> {
    constructor(
        public data: T | null = null,
        public message: string  = "Something went wrong",
        public isSuccess: boolean = false
    ){}
    

}