export class UserResponse {
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
  