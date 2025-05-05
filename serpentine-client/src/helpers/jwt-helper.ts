

export function getToken() : string | null {
  return localStorage.getItem('serpentine-token') || null;
}   

export function setToken(token: string) : void {
  localStorage.setItem('serpentine-token', token);
}

export function removeToken() : void {
  localStorage.removeItem('serpentine-token');
}
