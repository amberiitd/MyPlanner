export const googleLoginConfig = {
    id: 'google-login',
    label: "Google",
    bsIcon: "google",
    extraClasses: 'g-signin2',
    configure: ()=> {
        /* global google */
        const handleCredentialResponse = (response) => {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo?'+ new URLSearchParams({
                access_token: response.access_token
            }, )).then(response => response.json())
            .then(data => console.log(data));
        };
        const client = google.accounts.oauth2.initTokenClient({
            client_id: '502408217345-spodf96ae2nplj1sq4a7t802ssu8s7b8.apps.googleusercontent.com',
            scope: 'email profile ',
            callback: handleCredentialResponse
        });
        document.getElementById('google-login')?.addEventListener('click', ()=> {
            client.requestAccessToken()
        });
    }
}