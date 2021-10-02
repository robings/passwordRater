import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';
import apiCall from './apiCall';
import userEvent from '@testing-library/user-event';

jest.mock('./apiCall');

describe('on initial page load', () => {
    test('displays password input box', () => {
        render(<Form />);
        const passwordInput = screen.getByLabelText("Enter a password");
        expect(passwordInput).toBeInTheDocument();
    });

    test('displays reenter password input box, which is disabled', () => {
        render(<Form />);
        const passwordInput = screen.getByLabelText("Reenter password");
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toBeDisabled();
    });

    
    test('displays submit button, which is disabled', () => {
        render(<Form />);
        const submitButton = screen.getByRole("button", { name: "Submit" });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });
    
    test('does not display error div', () => {
        render(<Form />);
        expect(screen.queryByText("Error")).not.toBeInTheDocument();
    })

    test('does not display rating', () => {
        render(<Form />);
        expect(screen.queryByText(/Rating/i)).not.toBeInTheDocument();
    })
})

describe('rating display', () => {
    test('when 0 rating received shows weak password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(0));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText(/Weak/i)).toBeInTheDocument();
    })
    test('when 1 rating received shows meh password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(1));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText(/Meh/i)).toBeInTheDocument();
    })
    test('when 2 rating received shows good password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(2));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText(/Good/i)).toBeInTheDocument();
    })
    test('when 3 rating received shows excellent password text', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(3));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello'); // needed to trigger the mocked function

        expect(await screen.findByText(/Excellent/i)).toBeInTheDocument();
    })
})

describe('password input', () => {
    test('typing characters calls api', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockImplementation(() => Promise.resolve(3));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        await userEvent.type(passwordInput, 'he', { delay: 500 }); // delay needed due to debounce function.

        expect((apiCall as jest.MockedFunction<typeof apiCall>).mock.calls.length).toBe(1);
    })

    test('typing characters calls api, typing more call api again', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(3)).mockReturnValueOnce(Promise.resolve(0));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'he');

        await screen.findByText(/Excellent/i); // wait for debounced function to fire

        userEvent.type(passwordInput, 'he');

        await screen.findByText(/Weak/i); // wait for debounced function to fire

        expect((apiCall as jest.MockedFunction<typeof apiCall>).mock.calls.length).toBe(2);
        expect((apiCall as jest.MockedFunction<typeof apiCall>)).toHaveBeenNthCalledWith(1, "he");
        expect((apiCall as jest.MockedFunction<typeof apiCall>)).toHaveBeenNthCalledWith(2, "hehe");
    })

    test('typing characters calls api, then deleting all characters removes rating, disables Submit button', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(3));

        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'he');

        await screen.findByText(/Excellent/i); // wait for debounced function to fire
        expect((apiCall as jest.MockedFunction<typeof apiCall>).mock.calls.length).toBe(1);
        expect((apiCall as jest.MockedFunction<typeof apiCall>)).toHaveBeenCalledWith("he");

        userEvent.type(passwordInput, '{backspace}{backspace}');
        expect(passwordInput).toHaveValue('');
        expect(screen.queryByText('Excellent')).not.toBeInTheDocument(); // deleting the text needs to reset.
        expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    })
})

describe('password reentry input', () => {
    test('api response of 0 keeps input disabled', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(0)); // needed to enable password reentry input.
        
        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello');

        await screen.findByText(/Weak/i); // wait for debounced function to fire so screen is updated with response.

        expect(screen.getByLabelText("Reenter password")).toBeDisabled();
    })

    const enablingResponses = [ 1, 2, 3 ];

    test.each(enablingResponses)('api response other than 0 enables input', async (enablingReponse) => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(enablingReponse)); // needed to enable password reentry input.
        
        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        userEvent.type(passwordInput, 'hello1234!@£$');

        await screen.findByText(/Rating/i); // wait for debounced function to fire so screen is updated with enabled reenter password input.

        expect(screen.getByLabelText("Reenter password")).toBeEnabled();
    })

    test('typing same password in enabled input enables submit button', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(3)); // needed to enable password reentry input.
        
        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        const textToType = "hello";

        userEvent.type(passwordInput, textToType);

        await screen.findByText(/Rating/i); // wait for debounced function to fire so screen is updated with enabled reenter password input.
    
        const passwordReentryInput = screen.getByLabelText("Reenter password");

        userEvent.type(passwordReentryInput, textToType);

        expect(screen.getByRole('button', { name: 'Submit'})).toBeEnabled();
    })

    test('typing same password in enabled input, then deleting text disables Submit button again', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(3)); // needed to enable password reentry input.
        
        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        const textToType = "hello";

        userEvent.type(passwordInput, textToType);

        await screen.findByText(/Rating/i); // wait for debounced function to fire so screen is updated with enabled reenter password input.
    
        const passwordReentryInput = screen.getByLabelText("Reenter password");

        userEvent.type(passwordReentryInput, textToType);
        userEvent.type(passwordReentryInput, '{backspace}{backspace}');

        expect(screen.getByRole('button', { name: 'Submit'})).toBeDisabled();
    })

    test('typing same password in enabled input, then deleting text from password input disables Submit button again', async () => {
        (apiCall as jest.MockedFunction<typeof apiCall>).mockReturnValueOnce(Promise.resolve(3)); // needed to enable password reentry input.
        
        render(<Form />);

        const passwordInput = screen.getByLabelText("Enter a password");
        const textToType = "hello";

        userEvent.type(passwordInput, textToType);

        await screen.findByText(/Rating/i); // wait for debounced function to fire so screen is updated with enabled reenter password input.
    
        const passwordReentryInput = screen.getByLabelText("Reenter password");

        userEvent.type(passwordReentryInput, textToType);
        userEvent.type(passwordInput, '{backspace}{backspace}');

        expect(screen.getByRole('button', { name: 'Submit'})).toBeDisabled();
    })
})
