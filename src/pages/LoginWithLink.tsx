/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  useTheme,
  Alert,
  AlertColor,
  Link,
} from '@mui/material';
import { Box } from '@mui/system';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import apiFetch from '../utils/apifetch';
import config from '../config/config';
import useToken from '../utils/useToken';

type Params = {
    token: string;
}

interface LoginResponse {
    success?: boolean,
    message?: string,
    data?: {
      token: string,
    }
  }

export default function LoginWithLink() {
  const theme = useTheme();
  const { token } = useParams<Params>();
  const navigate = useNavigate();
  const { setToken } = useToken();

  // eslint-disable-next-line no-unused-vars
  const [alert, setAlert] = useState<{
    severerity: AlertColor,
    message: string
  }|null>(null);

  useEffect(() => {
    const loginWithLink = async (): Promise<LoginResponse> => apiFetch<LoginResponse>(`${config.API_URL}/login-with-link/${token}`);
    if (token) {
      loginWithLink().then((resp) => {
        if (resp.success) {
          setToken({
            token: resp?.data?.token || '',
          });
          navigate('/profile');
        } else {
          setAlert({
            severerity: 'error',
            message: resp.message || '',
          });
        }
      });
    }
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        component="div"
        sx={{
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="div"
          sx={{

            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(3),
          }}
        >
          {alert && (
            <>
              <Alert
                severity={alert?.severerity || undefined}
                sx={{
                  marginBottom: theme.spacing(4),
                }}
              >
                {alert?.message}
              </Alert>
              <Link component={RouterLink} to="/login">Return to Login</Link>
            </>

          )}
        </Box>
      </Box>
    </Container>
  );
}
