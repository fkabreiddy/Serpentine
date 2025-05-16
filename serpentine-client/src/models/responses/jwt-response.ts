export class JWTResponse {
  token: string;
  expiresIn: Date;
  issuer: string;
 
  constructor(
    token: string,
    expiresIn: Date,
    issuer: string,
    ) {

        this.token = token;
        this.expiresIn = expiresIn;
        this.issuer = issuer;
    }
}

export interface JwtPayload {
  nickname: string;
  sub: string;
  picture: string;
  name: string;
  exp: number;
  iss: string;
  aud: string;
  
}