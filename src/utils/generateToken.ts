import jwt, { Secret } from 'jsonwebtoken'

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET as Secret, { expiresIn: '15m' })
}
