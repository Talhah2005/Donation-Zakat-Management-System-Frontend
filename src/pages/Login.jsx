//Login.jsx
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}