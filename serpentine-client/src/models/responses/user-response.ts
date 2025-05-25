export class UserResponse {
    id: number = 0;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    fullName: string = '';
    username: string = '';
    profilePictureUrl: string = '';
    age: number = 0;
  
    constructor(
      fullName: string = '',
      username: string = '',
      profilePictureUrl: string = '',
      age: number = 0
    ) {
      this.fullName = fullName;
      this.username = username;
      this.profilePictureUrl = profilePictureUrl;
      this.age = age;
    }
  }
  