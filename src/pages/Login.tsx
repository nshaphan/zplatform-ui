/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Typography,
  Link,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Button,
  useTheme,
  Alert,
  AlertColor,
} from '@mui/material';
import { Box } from '@mui/system';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiFetch from '../utils/apifetch';
import config from '../config/config';
import useToken from '../utils/useToken';

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isPasswordLogin, setIsPasswordLogin] = React.useState(true);
  const [alert, setAlert] = useState<{
    severerity: AlertColor,
    message: string
  }|null>(null);
  const { setToken } = useToken();

  interface LoginInput {
    email: string;
    password: string;
  }

  type Field ='email' | 'password'

  interface BackendError {
    msg: string,
    param: Field,
  }

  interface LoginResponse {
    errors?: BackendError[],
    success?: boolean,
    message?: string,
    data?: {
      token: string,
    }
  }

  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<LoginInput>({
  });

  const onSubmit: SubmitHandler<LoginInput> = async (input) => {
    if (isPasswordLogin) {
      const response = await apiFetch<LoginResponse>(`${config.API_URL}/login`, 'POST', input);
      if (response.errors) {
        response.errors.forEach((error) => {
          setError(error.param, { type: 'manual', message: error.msg });
        });
      }
      if (response.success) {
        setToken({
          token: response?.data?.token || '',
        });
        navigate('/profile');
      } else {
        setAlert({
          severerity: 'error',
          message: response.message || '',
        });
      }
    } else {
      const response = await apiFetch<LoginResponse>(`${config.API_URL}/send-login-link`, 'POST', {
        email: input.email,
      });
      if (response.errors) {
        response.errors.forEach((error) => {
          setError(error.param, { type: 'manual', message: error.msg });
        });
      } else {
        setAlert({
          severerity: 'success',
          message: response.message || '',
        });
      }
    }
  };

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
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{

            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(3),
          }}
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          {alert && (
            <Alert
              severity={alert?.severerity || undefined}
              sx={{
                marginBottom: theme.spacing(4),
              }}
            >
              {alert?.message}
            </Alert>
          )}

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Grid>
            {isPasswordLogin ? (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  autoComplete="current-password"
                  {...register('password')}
                />
              </Grid>
            ) : ''}

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              margin: theme.spacing(3, 0, 2),
            }}
          >
            Login
          </Button>
          <Grid item xs={12}>
            <Typography align="center">Or</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                margin: theme.spacing(3, 0, 2),
              }}
              onClick={() => setIsPasswordLogin(!isPasswordLogin)}
            >
              {isPasswordLogin ? 'Login Without Password' : 'Login Password'}
            </Button>
          </Grid>
          <Grid component="div" container>
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
              xs={12}
            >
              <Link to="/signup" component={RouterLink} variant="body2">
                Create New Account
              </Link>
              <Link to="/signup" component={RouterLink} variant="body2">
                Forgot Password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
