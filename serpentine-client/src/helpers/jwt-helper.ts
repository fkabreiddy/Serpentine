import { JwtPayload } from "@/models/responses/jwt-response";
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'serpentine-token' as const;

/**
 * Retrieves the JWT token from local storage
 * @returns The stored token or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores the JWT token in local storage
 * @param token - The JWT token to store
 */
export function setToken(token: string): void {
  if (!token) throw new Error('Token cannot be empty');
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the JWT token from local storage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Checks if a JWT token is expired
 * @param exp - Expiration timestamp in seconds
 * @returns boolean indicating if the token is expired
 */
function isTokenExpired(exp: number): boolean {
  return exp < Date.now() / 1000;
}

/**
 * Decodes and validates a JWT token
 * @returns Decoded JWT payload or null if token is invalid or expired
 */
export function decode(): JwtPayload | null {
  try {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded || !decoded.exp) return null;

    return isTokenExpired(decoded.exp) ? null : decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}
