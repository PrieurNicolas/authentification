import jwt from 'jsonwebtoken';

export function jwtTokens({id, pseudo, email}: {id:number; pseudo: string; email: string}) {
    console.log(0)
    const user = {id, pseudo, email};
    console.log(1)
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:'20m'});
    console.log(2)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:'14d'});
    console.log(3)
    return ({accessToken,refreshToken});
};