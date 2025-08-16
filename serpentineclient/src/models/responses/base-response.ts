export abstract class BaseResponse {
    id: string = "";
    createdAt: string = new Date().toDateString();
    updatedAt: string = new Date().toDateString();

    constructor(init?: Partial<BaseResponse>) {
    Object.assign(this, init);
  }
  
}