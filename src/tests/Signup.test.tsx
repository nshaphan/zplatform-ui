/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import * as router from 'react-router';
import App from '../App';
import SignUp from '../pages/Signup';

const navigate = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });

  it('Should render successfully', async () => {
    render(<App />);
    await waitFor(() => {
      screen.getByText('Sign In');
    });
  });

  it('Should render signup page and user create an account', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });
    fetch.mockResponseOnce(JSON.stringify({
      success: true,
      message: 'Account created',
      data: {
        id: 1,
      },
    }));
    act(() => {
      fireEvent.change(screen.getByTestId('firstname'), { target: { value: 'shaphan' } });
      fireEvent.change(screen.getByTestId('lastname'), { target: { value: 'nzabonimana' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('dateOfBirth'), { target: { value: '2020-05-12' } });
      fireEvent.change(screen.getByTestId('gender'), { target: { value: 'Male' } });
      fireEvent.change(screen.getByTestId('maritalStatus'), { target: { value: 'SINGLE' } });
      fireEvent.change(screen.getByTestId('nationality'), { target: { value: 'Rwandan' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('signupBtn'));
    });
    // expect(navigate).toBeCalledWith('/login');
  });

  it('Should render errors', async () => {
    act(() => {
      render(
        <ThemeProvider theme={{}}>
          <BrowserRouter>
            <SignUp />
          </BrowserRouter>
        </ThemeProvider>,
      );
    });

    fetch.mockResponseOnce(JSON.stringify({
      errors: [{
        value: 'shaphannzabonimana@gmail.com',
        msg: 'User with this email already exists',
        param: 'email',
        location: 'body',
      }],
    }));
    await act(async () => {
      fireEvent.change(screen.getByTestId('firstname'), { target: { value: 'shaphan' } });
      fireEvent.change(screen.getByTestId('lastname'), { target: { value: 'nzabonimana' } });
      fireEvent.change(screen.getByTestId('email'), { target: { value: 'email@example.com' } });
      fireEvent.change(screen.getByTestId('dateOfBirth'), { target: { value: '2020-05-12' } });
      fireEvent.change(screen.getByTestId('gender'), { target: { value: 'Male' } });
      fireEvent.change(screen.getByTestId('maritalStatus'), { target: { value: 'SINGLE' } });
      fireEvent.change(screen.getByTestId('nationality'), { target: { value: 'Rwandan' } });
      fireEvent.change(screen.getByTestId('password'), { target: { value: '12345678' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: '12345678' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('signupBtn'));
    });

    waitFor(() => {
      screen.queryByText('email already exists');
    });
  });
});
