import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: any): string {
  const secret = "arvind"
  console.log('Generating token with secret:', secret, 'and payload:', payload)
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

export function verifyToken(token: string): any {
  const secret = "arvind"
  console.log('Verifying token with secret:', secret, 'token:', token.substring(0, 50) + '...')
  return jwt.verify(token, secret)
}