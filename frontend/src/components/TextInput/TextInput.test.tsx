import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextInput from './TextInput';

describe('<TextInput />', () => {
  test('it should mount', () => {
    render(<TextInput />);
    
    const textInput = screen.getByTestId('TextInput');

    expect(textInput).toBeInTheDocument();
  });
});