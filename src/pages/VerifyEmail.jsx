import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        let isMounted = true;
        const verifyToken = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                if (isMounted) {
                    setStatus('success');
                    setMessage(response.data.message);
                    toast.success(response.data.message);
                }
            } catch (error) {
                if (isMounted) {
                    setStatus('error');
                    const errorMsg = error.response?.data?.message || 'Verification failed. The link may be invalid or expired.';
                    setMessage(errorMsg);
                    toast.error(errorMsg);
                }
            }
        };

        if (token && status === 'verifying') {
            verifyToken();
        }

        return () => {
            isMounted = false;
        };
    }, [token, status]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary text-center">
                <CardHeader className="bg-primary-light border-b border-border">
                    <CardTitle className="text-foreground text-2xl">Email Verification</CardTitle>
                    <CardDescription>Finalizing your account registration</CardDescription>
                </CardHeader>
                <CardContent className="pt-10 pb-10 space-y-6">
                    {status === 'verifying' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            <h3 className="text-xl font-semibold">Verifying your email...</h3>
                            <p className="text-muted-foreground">Please wait while we confirm your account.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="h-20 w-20 text-primary" />
                            <h3 className="text-2xl font-bold text-primary">Verified Successfully!</h3>
                            <Link to="/login" className="w-full mt-4">
                                <Button className="w-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2 h-12 text-lg">
                                    Continue to Login
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <XCircle className="h-20 w-20 text-destructive" />
                            <h3 className="text-2xl font-bold text-destructive">Verification Failed</h3>
                            <div className="flex flex-col gap-3 w-full mt-4">
                                <Link to="/signup" className="w-full">
                                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light">
                                        Back to Signup
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full">
                                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                                        Try Logging In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
