interface LoginUserRequest {

    userName: string; // Mín: 3, Máx: 30, only words, numbers, dots and underscores
    password: string; // Mín: 8, Max: 30, at least one uppercase letter, one number and one symbol

}

export default LoginUserRequest;