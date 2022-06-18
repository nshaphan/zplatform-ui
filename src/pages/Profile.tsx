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
  Button,
  Link,
} from '@mui/material';
import { Box } from '@mui/system';
import { Navigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiFetch from '../utils/apifetch';
import config from '../config/config';
import useToken from '../utils/useToken';
import VerifyDialog from '../components/VerifyDialog';

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

  const getUseProfile = () => {
    apiFetch<ProfileResponse>(`${config.API_URL}/profile`, 'GET', {}, {
      authorization: token,
    }).then((res) => {
      if (res.success) {
        setProfile(res.data?.user || null);
      }
    });
  };

  useEffect(() => {
    getUseProfile();
  }, []);

  const verifyProfile = async (id: number) => {
    const response = await apiFetch<ProfileResponse>(`${config.API_URL}/verify-profile`, 'POST', {
      id,
    });

    if (response.success) {
      getUseProfile();
    }
  };

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
            {profile?.status === 'PENDING' ? (<Button onClick={() => verifyProfile(profile?.id || 0)}>Mark As Verified</Button>) : ''}
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
                sx={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {`${profile?.firstName} ${profile?.lastName}`}
                {profile?.status === 'VERIFIED' ? (
                  <CheckCircleIcon sx={{ marginLeft: theme.spacing(1) }} color="info" />
                ) : ''}
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
                  <VerifyDialog id={profile?.id || 0} getUserProfile={getUseProfile} />
                </Alert>
              ) : ''}

              {profile?.status === 'PENDING' ? (
                <Alert
                  severity="info"
                  sx={{
                    textAlign: 'center',
                    marginTop: theme.spacing(2),
                  }}
                >
                  We are reviewing your profile information.
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
                {profile?.documentAttachment ? (
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center',
                        marginTop: theme.spacing(2),
                      }}
                      component="div"
                    >
                      <Link target="_blank" href={`${config.API_URL}/media/${profile?.documentAttachment}`}>View ID Document</Link>

                    </Typography>
                  </Grid>
                ) : ''}

              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
