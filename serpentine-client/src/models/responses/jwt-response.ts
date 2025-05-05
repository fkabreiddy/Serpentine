class JWTResponse {
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