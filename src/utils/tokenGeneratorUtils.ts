import * as jwt from "jsonwebtoken"
import AuthenticatorInterface from "../model/authenticator/authenticatorInterface"

export default class TokenGeneratorUtils {
    public generateToken(
        payload: AuthenticatorInterface
    ): string {
        return jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string
            }
        )
    }

    public getTokenData(
        token: string
    ): AuthenticatorInterface {
        const data = jwt.verify(
            token,
            process.env.JWT_KEY as string
        )
        return data as AuthenticatorInterface
    }

}