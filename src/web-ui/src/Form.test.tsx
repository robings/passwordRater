import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

test('renders input box', () => {
    render(<Form />);
    const passwordLabel = screen.getByLabelText("Enter a password");
    expect(passwordLabel).toBeInTheDocument();
});

test('renders submit button', () => {
    render(<Form />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
});
