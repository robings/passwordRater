import React, { useState } from 'react';

function Form(): JSX.Element {
    const [ currentPassword, setCurrentPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error !== "") {
            setError("");
        }

        setCurrentPassword(e.target.value);

        if (e.target.value.toLowerCase() === "password") {
            setError("Don't use password as a password!");
        }

        if (currentPassword !== "") {
            await postPasswordForEvaluation(currentPassword);
        }
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
            }    
        }
        catch {
            setError("Error validating password.")
        }
      }

    return (
        <form>
            <label htmlFor="password">Enter a password</label>
            <input type="text" name="password" id ="password" onChange={handleInputChange} />
            <button>Submit</button>
            <div>{currentPassword}</div>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default Form;