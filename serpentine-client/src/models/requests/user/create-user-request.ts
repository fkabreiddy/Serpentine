
export interface CreateUserRequest {
    userName: string;           // Min: 3, Max: 30, only letters, numbers, dots and underscores
    password: string;           // Min: 8, at least one uppercase, one number and one symbol
    confirmPassword: string;    // Same as password
    fullName: string;           // Min: 10, Max: 30, letters, numbers and spaces
    imageFile?: File | null;    // Extensions: jpg, png, webp, img, jpeg. Optional   
    profilePictureUrl?: string | null;    // Same as password

}

 