abstract class BaseResponse {
    id: number = 0;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    constructor(init?: Partial<BaseResponse>) {
    Object.assign(this, init);
  }
  
}