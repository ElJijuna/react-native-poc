export const DEMO_USERNAME = 'user';
export const DEMO_PASSWORD = 'user';

export function validateCredentials(username: string, password: string) {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}
