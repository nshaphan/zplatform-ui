/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import * as router from 'react-router';
import fetch from 'jest-fetch-mock';
import Login from '../pages/Login';

const navigate = jest.fn();
jest.mock('jwt-decode', () => () => ({
  id: 1,
  email: '123@example.com',
}));

describe('Login Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });

  it('Should render Login page and user log in', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: true,
      message: 'Logged in successfully',
      data: {
        token: 'xyz',
        user: {
          id: 1,
          isTwoFactorEnabled: false,
        },
      },
    }));
    act(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginBtn'));
    });
    expect(navigate).toBeCalledWith('/profile');
  });

  it('Should redirect user with two factor auth to a page to enter OTP Code', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: 1,
          isTwoFactorEnabled: true,
        },
      },
    }));
    act(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginBtn'));
    });
    expect(navigate).toBeCalledWith('/otp-login/1');
  });
  it('Should show invalid credentials error', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: false,
      message: 'Invalid credentials',
      data: {
        user: {
          id: 1,
          isTwoFactorEnabled: false,
        },
      },
    }));
    act(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginBtn'));
    });

    screen.findByText('Invalid credentials');
  });

  it('Should redirect user with two factor auth to a page to enter OTP Code', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: 1,
          isTwoFactorEnabled: true,
        },
      },
    }));
    act(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginBtn'));
    });
    expect(navigate).toBeCalledWith('/otp-login/1');
  });
  it('Should allow user to login without password', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: false,
      message: 'Login link sent your email',
      data: {
        user: {
          id: 1,
          isTwoFactorEnabled: false,
        },
      },
    }));

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginwithoutPassBtn'));
    });

    act(() => {
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('loginBtn'));
    });
    expect(screen.getByText('Login link sent your email'));
  });
});
