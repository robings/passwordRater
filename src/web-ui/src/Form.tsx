import React from 'react';

function Form() {
    return (
        <form>
            <label htmlFor="password">Enter a password</label>
            <input type="text" name="password" id ="password" />
        </form>
    );
}

export default Form;