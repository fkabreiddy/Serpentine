import { BaseResponse } from "./base-response";

export class UserResponse extends BaseResponse {
    
    fullName: string = '';
    username: string = '';
    profilePictureUrl: string = '';
    age: number = 0;
    accessLevel: number = 0;
  
    constructor(init?: Partial<UserResponse>) {
      super(init); 
      Object.assign(this, init);
    }
  }
  