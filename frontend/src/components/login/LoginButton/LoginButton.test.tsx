import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginButton from './LoginButton';

describe('<Login-button />', () => {
  test('it should mount', () => {
    render(<LoginButton />);
    
    const loginButton = screen.getByTestId('Login-button');

    expect(loginButton).toBeInTheDocument();
  });
});