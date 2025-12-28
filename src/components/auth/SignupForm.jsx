// SignupForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        // Don't send confirmPassword to backend
        const { confirmPassword, ...signupData } = formData;
        const result = await signup(signupData);

        if (result.success) {
            toast.success('Registration successful! Check your email.');
            setSuccessMessage(result.message);
        } else {
            toast.error(result.message);
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            toast.success('Google Signup successful!');
            navigate(result.user.role === 'admin' ? '/admin/dashboard' : `/user/dashboard/${result.user.id}`);
        } else {
            toast.error(result.message || 'Google signup failed');
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google Signup failed. Please try again.');
    };

    if (successMessage) {
        return (
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary text-center">
                <CardHeader className="bg-primary-light border-b border-border">
                    <CardTitle className="text-foreground text-2xl">Confirm Your Email</CardTitle>
                    <CardDescription>Thank you for joining Saylani Welfare</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 pb-8 space-y-4">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-foreground font-medium">{successMessage}</p>
                    <p className="text-sm text-muted-foreground">Please check your inbox and click the verification button to activate your account.</p>
                    <div className="pt-4">
                        <Link to="/login">
                            <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="bg-primary-light border-b border-border p-4 md:p-6">
                <CardTitle className="text-foreground text-xl md:text-2xl font-bold leading-tight">Create Account</CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Join Saylani Welfare and start making a difference</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-6">
                    <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="name" className="text-xs md:text-sm">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border-primary/30 focus:border-primary h-9 md:h-10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-primary/30 focus:border-primary h-9 md:h-10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="phone" className="text-xs md:text-sm">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="03001234567"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10,15}"
                            className="border-primary/30 focus:border-primary h-9 md:h-10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="password" className="text-xs md:text-sm">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border-primary/30 focus:border-primary h-9 md:h-10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs md:text-sm">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="border-primary/30 focus:border-primary h-9 md:h-10 text-sm"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 p-4 md:p-6 pt-0">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white shadow-md font-bold h-10 md:h-12 border-0" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>

                    <div className="relative w-full py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="signup_with"
                            width="250"
                        />
                    </div>

                    <p className="text-xs md:text-sm text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-bold">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}