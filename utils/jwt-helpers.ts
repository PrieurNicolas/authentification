import jwt from 'jsonwebtoken';

export function jwtTokens({id, pseudo, email}: {id:number; pseudo: string; email: string}) {
    const user = {id, pseudo, email};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:'30m'});
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:'14d'});
    return ({accessToken,refreshToken});
};