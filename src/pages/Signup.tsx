/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Typography,
  Link,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Button,
  useTheme,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Box } from '@mui/system';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiFetch from '../utils/apifetch';
import config from '../config/config';

export default function SignUp() {
  const theme = useTheme();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    gender: yup.string().required('Gender is required'),
    dateOfBirth: yup.string().required('Date Of Birth is required'),
    maritalStatus: yup.string().required('Marital Status is required'),
    nationality: yup.string().required('Nationality is required'),
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string().required('Confirmation password is required'),
    isTwoFactorEnabled: yup.boolean(),
  });

  interface ProfileInput {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    nationality: string;
    email: string;
    password: string;
    confirmPassword: string;
    isTwoFactorEnabled: boolean;
  }

  type Field =
   'firstName'
  | 'lastName' | 'gender'
   | 'dateOfBirth' | 'maritalStatus'
   | 'nationality' | 'email' | 'password'
   | 'confirmPassword' | 'isTwoFactorEnabled'

  interface BackendError {
    msg: string,
    param: Field,
  }

  interface SignupResponse {
    errors?: BackendError[],
    success?: boolean,
    message?: string,
    data?: {
      id: number,
    }
  }

  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<ProfileInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ProfileInput> = async (input) => {
    const response = await apiFetch<SignupResponse>(`${config.API_URL}/signup`, 'POST', input);
    if (response.errors) {
      response.errors.forEach((error) => {
        setError(error.param, { type: 'manual', message: error.msg });
      });
    } else {
      navigate('/login');
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
          Sign up
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName')}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName')}
              />
            </Grid>
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
            <Grid item xs={12} />
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                type="date"
                fullWidth
                id="birthdate"
                label="Birth Date"
                autoFocus
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Gender"
                SelectProps={{
                  native: true,
                }}
                fullWidth
                error={!!errors.gender}
                helperText={errors.gender?.message}
                {...register('gender')}
              >
                <option>Male</option>
                <option>Female</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-select-currency-native"
                label="Marital Status"
                SelectProps={{
                  native: true,
                }}
                select
                fullWidth
                error={!!errors.maritalStatus}
                helperText={errors.maritalStatus?.message}
                {...register('maritalStatus')}
              >
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Nationality"
                type="nationality"
                id="nationality"
                error={!!errors.nationality}
                helperText={errors.nationality?.message}
                {...register('nationality')}
              />
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirm-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="true" color="primary" {...register('isTwoFactorEnabled')} />}
                label="Enable two-factor authentication, for enhanced security."
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
            Sign Up
          </Button>
          <Grid component="div" container>
            <Grid item>
              <Link to="/login" component={RouterLink} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
