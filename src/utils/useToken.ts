import { useState } from 'react';

interface UserToken {
  token: string;
}
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString || '{}');
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: UserToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
