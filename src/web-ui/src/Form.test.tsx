import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';
import apiCall from './apiCall';
import userEvent from '@testing-library/user-event';

jest.mock('./apiCall');

describe('on initial render', () => {
    test('renders input box', () => {
        render(<Form />);
        const passwordInput = screen.getByLabelText("Enter a password");
        expect(passwordInput).toBeInTheDocument();
    });
    
    test('renders submit button', () => {
        render(<Form />);
        expect(screen.getByText("Submit")).toBeInTheDocument();
    });
    
    test('does not display error div', () => {
        render(<Form />);
        expect(screen.queryByText("Error")).not.toBeInTheDocument();
    })
})

describe('response display', () => {
    test('when 0 rating received shows weak password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(0));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText('Weak')).toBeInTheDocument();
    })
    test('when 1 rating received shows meh password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(1));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText('Meh')).toBeInTheDocument();
    })
    test('when 2 rating received shows good password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(2));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText('Good')).toBeInTheDocument();
    })
    test('when 3 rating received shows excellent password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(3));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText('Excellent')).toBeInTheDocument();
    })
})

describe('password input', () => {
    test('typing characters with delay calls api more than once', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(3));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        await userEvent.type(passwordInput, 'hello', { delay: 500 }); // needed to trigger the mocked function

        expect((apiCall as jest.MockedFunction<typeof apiCall>).mock.calls.length).toBeGreaterThan(1);
    })
})
