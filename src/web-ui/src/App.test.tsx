import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders form', () => {
  render(<App />);
  const passwordLabel = screen.getByLabelText("Enter a password");
  expect(passwordLabel).toBeInTheDocument();
});
