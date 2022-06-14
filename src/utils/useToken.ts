import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

interface UserToken {
  token: string;
}

interface TokenPayload {
  id: number,
  email: string;
  exp: number;
}
export default function useToken() {
  const [isValid, setIsValid] = useState(true);

  const checkToken = (token: string) => {
    if (!token || token === '') {
      setIsValid(false);
      return;
    }
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.clear();
      setIsValid(false);
    }
  };

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString || '{}');
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  useEffect(() => {
    checkToken(token);
  }, [token]);

  const saveToken = (userToken: UserToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const logout = () => {
    localStorage.clear();
    setIsValid(false);
  };

  return {
    setToken: saveToken,
    logout,
    token,
    isValid,
  };
}
