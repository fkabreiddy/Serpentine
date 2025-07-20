export abstract class BaseResponse {
    id: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    constructor(init?: Partial<BaseResponse>) {
    Object.assign(this, init);
  }
  
}