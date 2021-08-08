import React, { FormEvent, useState } from 'react';

function Form(): JSX.Element {
    const [ currentPassword, setCurrentPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");
    const [ rating, setRating ] = useState<{ text: string, className: string }>({ text: "", className: ""});


    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error !== "") {
            setError("");
        }

        setCurrentPassword(e.target.value);

        if (currentPassword !== "") {
            postPasswordForEvaluation(e.target.value);
        }
    }

    const handleSubmit = (e: FormEvent) => {
        alert(`Password Submitted was ${currentPassword}`);
        e.preventDefault();
    }

    async function postPasswordForEvaluation(password: string) {
        let response: Response;
        try{
            response = await fetch("https://localhost:5000/PasswordRater", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/problem+json',
                    'Origin': 'http://localhost:3000'
                },
                body: JSON.stringify({ password: password })
            });

            if (response.status !== 200) {
                setError("Error validating password.")
                return;
            }

            const result: number = await response.json();
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

            setRating({ text: resultAsText, className: resultClassName});
        }
        catch {
            setError("Error validating password.")
        }
      }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="passwordInput">Enter a password</label>
            <input className={rating.className} type="password" name="passwordInput" id ="passwordInput" value={currentPassword} onChange={handleInputChange} />
            <input type="submit" disabled={ rating.text==='' || rating.text === 'Weak'} value="Submit" />
            {rating && <div className={'message ' + rating.className}>{rating.text}</div>}
            {error && <div className="message error">{error}</div>}
        </form>
    );
}

export default Form;