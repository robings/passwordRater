import React, { FormEvent, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import apiCall from './apiCall';
import { DebouncedFunc } from 'lodash';

function Form(): JSX.Element {
    const [ currentPassword, setCurrentPassword ] = useState<string>("");
    const [ currentReenteredPassword, setCurrentReenteredPassword ] = useState<string>("");
    const [ disableSubmit, setDisableSubmit ] = useState<boolean>(true);
    const [ error, setError ] = useState<string>("");
    const [ rating, setRating ] = useState<{ text: string, className: string }>({ text: "", className: ""});

    const processResult = (result: number): { text: string, className: string } => {
        let resultAsText: string;
        let resultClassName: string;

        switch(result){
            case 1:
                resultAsText = "Meh";
                resultClassName = "warning";
                break;
            case 2:
                resultAsText = "Good";
                resultClassName = "lightWarning";
                break;
            case 3:
                resultAsText = "Excellent";
                resultClassName = "greenLight";
                break;
            default:
                resultAsText = "Weak";
                resultClassName = "redLight";
                break;
        }

        return { text: resultAsText, className: resultClassName };
    }

    const postPasswordForEvaluation: () => Promise<void> = useCallback(async (): Promise<void> => {
        await apiCall(currentPassword).then(data => {
            setRating(processResult(data));
        }).catch(() => {
            setError("Error validating password.");
            setRating({ text: "", className: ""});
        })
    }, [currentPassword]);

    const delayedPasswordEvaluation = useMemo<DebouncedFunc<() => Promise<void>>>(
        () => debounce(() => postPasswordForEvaluation(), 500), [postPasswordForEvaluation])

    const handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        if (error !== "") {
            setError("");
        }

        setCurrentPassword(e.target.value);

        determineSubmitButtonState(e.target.value, currentReenteredPassword);
    }

    const handleReenteredPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        if (error !== "") {
            setError("");
        }

        setCurrentReenteredPassword(e.target.value);

        determineSubmitButtonState(currentPassword, e.target.value);
    }

    const determineSubmitButtonState: (currentPassword: string, currentReenteredPassword: string) => void = (currentPassword, currentReenteredPassword) => {
        if (
            (currentPassword && currentReenteredPassword) &&
            currentPassword === currentReenteredPassword
        ) {
            setDisableSubmit(false);
        } else if (disableSubmit === false) {
            setDisableSubmit(true);
        }
    }

    useEffect(() => {
        if (currentPassword !== "") {
            delayedPasswordEvaluation();
        } else {
            setRating({ text: "", className: ""});
        }

        return delayedPasswordEvaluation.cancel;
    }, [currentPassword, delayedPasswordEvaluation])

    const handleSubmit:(e: FormEvent) => void = (e) => {
        alert(`Password Submitted was ${currentPassword}`);
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Password</h1>
            {error && <div className="message error">{error}</div>}
            <div className="inputGroup">
                <label htmlFor="passwordInput">Enter a password</label>
                <input className={rating.className} type="password" name="passwordInput" id ="passwordInput" value={currentPassword} onChange={handlePasswordInputChange} />
            </div>
            {rating.text !== "" && <div className={'message ' + rating.className}>Rating: {rating.text}</div>}
            <div className="inputGroup">
                <label htmlFor="reenterPasswordInput">Reenter password</label>
                <input type="password" disabled={ rating.text==='' || rating.text === 'Weak'} name="reenterPasswordInput" id ="reenterPasswordInput" value={currentReenteredPassword} onChange={handleReenteredPasswordChange} />
            </div>
            <input type="submit" disabled={ disableSubmit } value="Submit" />
        </form>
    );
}

export default Form;
