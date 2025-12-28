// LoginForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            toast.success('Login successful!');
            navigate(result.user.role === 'admin' ? '/admin/dashboard' : `/user/dashboard/${result.user.id}`);
        } else {
            toast.error(result.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            toast.success('Google Login successful!');
            navigate(result.user.role === 'admin' ? '/admin/dashboard' : `/user/dashboard/${result.user.id}`);
        } else {
            toast.error(result.message || 'Google login failed');
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google Login failed. Please try again.');
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="bg-primary-light border-b border-border p-4 md:p-6">
                <CardTitle className="text-foreground text-xl md:text-2xl font-bold leading-tight">Welcome Back</CardTitle>
                <CardDescription className="text-xs md:text-sm">Please login to continue to Saylani Welfare</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 p-4 md:p-6 pt-6">
                    <div className="space-y-2">
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs md:text-sm">Password</Label>
                            <Link to="/forgot-password" opacity={0.8} className="text-[11px] md:text-sm text-primary hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
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
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 p-4 md:p-6 pt-0">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white shadow-md font-bold h-10 md:h-12 border-0" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
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
                            text="signin_with"
                            width="250"
                        />
                    </div>

                    <p className="text-xs md:text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-bold">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}