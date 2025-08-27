export abstract class BaseResponse {
    id: string = "";
    createdAt: string = "";
    updatedAt: string = "";
    createdAtIso: string = "";
    updatedAtIso: string = "";

    constructor(init?: Partial<BaseResponse>) {
    Object.assign(this, init);
  }
  
}