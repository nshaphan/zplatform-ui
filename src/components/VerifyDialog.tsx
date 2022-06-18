/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import apiFetch from '../utils/apifetch';
import config from '../config/config';

type Field = 'documentType' | 'idNumber' | 'documentAttachment';

interface ProfileInput {
    documentType: string;
    idNumber: string;
    documentAttachment: string;
}

interface BackendError {
    msg: string,
    param: Field,
  }

interface UpdateResponse {
    errors?: BackendError[],
    success?: boolean,
    message?: string,
    data?: {
      id: number,
    }
  }

interface Props {
    id: number;
    getUserProfile: () => void;
}

export default function VerifyDialog(props: Props) {
  const { id, getUserProfile } = props;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const [userId, setUserId] = React.useState(0);

  React.useEffect(() => {
    setUserId(id);
  }, [id]);

  const schema = yup.object().shape({
    documentType: yup.string().required('Document type is required'),
    idNumber: yup.string().required('Document number is required'),
  });

  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<ProfileInput>({
    resolver: yupResolver(schema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<ProfileInput> = async (input) => {
    const data = new FormData();

    data.append('id', userId.toString());
    data.append('documentType', input.documentType);
    data.append('idNumber', input.idNumber);
    data.append('documentAttachment', input.documentAttachment[0]);

    const response = await apiFetch<UpdateResponse>(`${config.API_URL}/update-profile`, 'POST', data || null, {}, false);

    if (response.errors) {
      response.errors.forEach((error) => {
        setError(error.param, { type: 'manual', message: error.msg });
      });
    } else {
      handleClose();
      getUserProfile();
    }
  };

  return (
    <>
      <Button sx={{ marginLeft: theme.spacing(2) }} onClick={handleClickOpen}>
        Click Here to verify
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload your identification document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To verify your account you need to upload your identification document.
          </DialogContentText>
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
              <Grid item xs={12}>
                <TextField
                  select
                  label="Document Type"
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                  error={!!errors.documentType}
                  helperText={errors.documentType?.message}
                  {...register('documentType')}
                >
                  <option>ID</option>
                  <option>PASSPORT</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="idNumber"
                  label="Document Number"
                  error={!!errors.idNumber}
                  helperText={errors.idNumber?.message}
                  {...register('idNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    {...register('documentAttachment')}
                  />
                </Button>
                <Typography sx={{ marginLeft: theme.spacing(2) }} variant="caption">File</Typography>
              </Grid>
            </Grid>
            <DialogActions>
              <Button type="button" onClick={handleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </Box>
        </DialogContent>

      </Dialog>
    </>
  );
}
