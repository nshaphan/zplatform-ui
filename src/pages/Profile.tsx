/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  useTheme,
  AlertColor,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Alert,
  Link,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import apiFetch from '../utils/apifetch';
import config from '../config/config';
import useToken from '../utils/useToken';

interface ProfileData {
    id?: number;
      profilePhoto?: string;
      firstName?: string;
      lastName?: string;
      gender?: string;
      age?: number;
      dateOfBirth?: string;
      maritalStatus?: string;
      nationality?: string;
      email?: string;
      status?: string;
      documentType?: string;
      idNumber?: string;
      documentAttachment?: string;
      isVerification?: boolean;
  }

interface ProfileResponse {
    status:number;
    success?: boolean,
    message?: string,
    data?: {user: ProfileData}
  }

export default function Profile() {
  const theme = useTheme();
  const { token, isValid, logout } = useToken();

  const [profile, setProfile] = useState<ProfileData | null>(null);

  // eslint-disable-next-line no-unused-vars
  const [alert, setAlert] = useState<{
    severerity: AlertColor,
    message: string
  }|null>(null);

  useEffect(() => {
    const getUseProfile = async (): Promise<ProfileResponse> => apiFetch<ProfileResponse>(`${config.API_URL}/profile`, 'GET', {}, {
      authorization: token,
    });

    getUseProfile().then((res) => {
      if (res.success) {
        setProfile(res.data?.user || null);
      }
    });
  }, []);

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return (
    <Container component="main" maxWidth="md">
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
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <Button onClick={() => logout()}>Logout</Button>
          </Box>
          <Card
            variant="outlined"
          >
            <CardMedia sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            >
              <Avatar
                alt="Remy Sharp"
                src=""
                className=""
                sx={{
                  width: theme.spacing(12),
                  height: theme.spacing(12),
                  margin: theme.spacing(2, 2, 0),
                }}
              />
            </CardMedia>
            <CardContent>
              <Typography
                variant="h6"
                align="center"
              >
                {`${profile?.firstName} ${profile?.lastName}`}
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
              >
                {profile?.email}
              </Typography>
              {' '}
              <Typography
                color="textSecondary"
                variant="subtitle1"
                align="center"
              >
                {profile?.gender}
                {' '}
                -
                {' '}
                {profile?.maritalStatus}
              </Typography>
              {profile?.status === 'UN_VERIFIED' ? (
                <Alert
                  severity="error"
                  sx={{
                    textAlign: 'center',
                    marginTop: theme.spacing(2),
                  }}
                >
                  Your account is not verified
                  <Link sx={{ marginLeft: theme.spacing(2) }} to="/signup" component={RouterLink} variant="body2">
                    Click Here to verify
                  </Link>
                </Alert>
              ) : ''}

              <Divider sx={{
                marginTop: theme.spacing(4),
              }}
              />
              <Grid
                container
                sx={{
                  marginTop: theme.spacing(4),
                }}
              >
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                    component="span"
                  >
                    Nationality:

                  </Typography>
                  {' '}
                  {profile?.nationality}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                    component="span"
                  >
                    Date Of Birth:

                  </Typography>
                  {' '}
                  {profile?.dateOfBirth}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                    component="span"
                  >
                    ID Number:

                  </Typography>
                  {' '}
                  {profile?.idNumber || 'N/A'}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
