import React, { useState } from 'react';

function Form(): JSX.Element {
    const [ currentPassword, setCurrentPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error !== "") {
            setError("");
        }

        setCurrentPassword(e.target.value);
        
        if (e.target.value.toLowerCase() === "password") {
            setError("Don't use password as a password!");
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