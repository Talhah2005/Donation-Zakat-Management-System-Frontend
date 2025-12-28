//Signup.jsx
import SignupForm from '../components/auth/SignupForm';

export default function Signup() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}