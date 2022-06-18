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
import { Link as RouterLink } from 'react-router-dom';
import apiFetch from '../utils/apifetch';
import config from '../config/config';

export default function ForgotPassword() {
  const theme = useTheme();
  const [alert, setAlert] = useState<{
    severerity: AlertColor;
    message: string;
  } | null>(null);

  interface LoginInput {
    email: string;
  }

  type Field = 'email';

  interface BackendError {
    msg: string;
    param: Field;
  }

  interface LoginResponse {
    errors?: BackendError[];
    success?: boolean;
    message?: string;
    data?: {
      token?: string;
    };
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({});

  const onSubmit: SubmitHandler<LoginInput> = async (input) => {
    const response = await apiFetch<LoginResponse>(
      `${config.API_URL}/reset-password`,
      'POST',
      {
        email: input.email,
      },
    );
    if (response.errors) {
      response.errors.forEach((error) => {
        setError(error.param, { type: 'manual', message: error.msg });
      });
    }
    if (response.success) {
      setAlert({
        severerity: 'info',
        message: response.message || '',
      });
    } else {
      setAlert({
        severerity: 'error',
        message: response.message || '',
      });
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
          {alert?.message && (
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
                id="otp"
                label="Enter the code sent on email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Grid>
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
            Send Reset Email
          </Button>
          <Grid component="div" container>
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
              xs={12}
            >
              <Link to="/login" component={RouterLink} variant="body2">
                Back to login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
