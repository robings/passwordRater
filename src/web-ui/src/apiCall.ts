export default async function apiCall(password: string): Promise<number> {
    return await fetch("http://localhost:5000/PasswordRater", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/problem+json',
            'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ password: password })
    }).then((response) => {
        return response.json()
    })
}
