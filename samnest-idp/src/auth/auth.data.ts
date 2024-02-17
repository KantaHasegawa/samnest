export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const USERS: User[] = [
  {
    id: 1,
    name: 'Kanta',
    email: 'kanta@email.com',
    password: 'password',
  },
  {
    id: 2,
    name: 'Hasegawa',
    email: 'hasegawa@email.com',
    password: 'password',
  },
];

export const AUTH_TOKENS = [
  {
    id: 1,
    token: 'token-1',
  },
  {
    id: 2,
    token: 'token-2',
  },
];
