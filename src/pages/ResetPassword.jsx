import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { KeyRound, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const emailFromQuery = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        email: emailFromQuery,
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            toast.success('Password reset successful! Redirecting to login...');
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
                <CardHeader className="bg-primary-light border-b border-border">
                    <CardTitle className="text-foreground text-2xl">Reset Password</CardTitle>
                    <CardDescription>Enter the OTP sent to your email and your new password</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                readOnly={!!emailFromQuery}
                                className="border-primary/30 focus:border-primary bg-secondary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 border-primary/30 focus:border-primary tracking-widest text-center text-lg font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="pl-10 border-primary/30 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 border-primary/30 focus:border-primary"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white shadow-md"
                            disabled={loading}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1 font-medium">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
