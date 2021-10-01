import React, { FormEvent, useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import apiCall from './apiCall';
import { DebouncedFunc } from 'lodash';

function Form(): JSX.Element {
    const [ currentPassword, setCurrentPassword ] = useState<string>("");
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

    const handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        if (error !== "") {
            setError("");
        }

        setCurrentPassword(e.target.value);
    }

    useEffect(() => {
        if (currentPassword !== "") {
            delayedPasswordEvaluation();
        }

        return delayedPasswordEvaluation.cancel;
    }, [currentPassword, delayedPasswordEvaluation])

    const handleSubmit:(e: FormEvent) => void = (e) => {
        alert(`Password Submitted was ${currentPassword}`);
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="passwordInput">Enter a password</label>
            <input className={rating.className} type="password" name="passwordInput" id ="passwordInput" value={currentPassword} onChange={handleInputChange} />
            <input type="submit" disabled={ rating.text==='' || rating.text === 'Weak'} value="Submit" />
            {rating.text !== "" && <div className={'message ' + rating.className}>{rating.text}</div>}
            {error && <div className="message error">{error}</div>}
        </form>
    );
}

export default Form;
