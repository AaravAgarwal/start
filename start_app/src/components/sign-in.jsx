import { signInWithGooglePopup } from "../utils/firebase.utils"
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        const user = response.user;
            
        const userData = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            token: user.accessToken
        };


        console.log(userData)

        const backendResponse = await fetch('http://localhost:5000/verify_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include' // Include cookies for session management
        });
        
        if (backendResponse.status === 401) {
            sessionStorage.setItem('pendingUser', JSON.stringify(userData));
            window.location.href = '/onboarding';
            return;
        }

        if (!backendResponse.ok) {
            throw new Error('Failed to authenticate with backend');
        }
        
        const data = await backendResponse.json();

        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        console.log('Authentication successful:', data);
        window.location.href = "/dashboard";
    }
return (
        <button id="oauth" onClick={logGoogleUser}>Sign in with Google</button>
    )
}

export default SignIn;