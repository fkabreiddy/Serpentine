import  ValidationResult  from "@/models/validation-result";

export interface CreateUserRequest {
    userName: string;           // Min: 3, Max: 30, only letters, numbers, dots and underscores
    password: string;           // Min: 8, at least one uppercase, one number and one symbol
    confirmPassword: string;    // Same as password
    fullName: string;           // Min: 10, Max: 30, letters, numbers and spaces
    age: number;                // Between 16 and 100
    imageFile?: File | null;    // Extensions: jpg, png, webp, img, jpeg. Optional
}


  
export function validateCreateUserRequest(data: CreateUserRequest): ValidationResult<CreateUserRequest> {
    const errors: Partial<Record<keyof CreateUserRequest, string>> = {};
  
    // Validate userName
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(data.userName)) {
      errors.userName = "El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos y guiones bajos.";
    }
  
    // Validate password
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(data.password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.";
    }
  
    // Confirm password
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }
  
    // Validate fullName
    if (!/^[a-zA-ZÀ-ÿ0-9 ]{10,30}$/.test(data.fullName)) {
      errors.fullName = "El nombre completo debe tener entre 10 y 30 caracteres, y solo puede contener letras, números y espacios.";
    }
  
    // Validate age
    if (data.age < 16 || data.age > 100) {
      errors.age = "La edad debe estar entre 16 y 100 años.";
    }
  
    // Validate imageFile (if present)
    if (data.imageFile) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'img'];
      const fileName = data.imageFile.name.toLowerCase();
      const extension = fileName.split('.').pop();
  
      if (!extension || !allowedExtensions.includes(extension)) {
        errors.imageFile = "La imagen debe tener una extensión válida: jpg, jpeg, png, webp o img.";
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
  