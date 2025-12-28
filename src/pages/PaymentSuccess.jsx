//PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../api/axios';
import { CheckCircle, LayoutDashboard, Target, Mail } from 'lucide-react';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const confirmDonation = async () => {
            if (sessionId) {
                try {
                    await api.post('/payment/confirm-checkout', { sessionId });
                    setLoading(false);
                } catch (err) {
                    console.error('Error confirming donation:', err);
                    setError(err.response?.data?.message || 'Error confirming your donation record');
                    setLoading(false);
                }
            } else {
                setError('No session ID found');
                setLoading(false);
            }
        };

        confirmDonation();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Processing your payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Card className="max-w-md mx-auto border-destructive border-t-4 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <CheckCircle className="h-6 w-6" />
                            Payment Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{error}</p>
                        <Button onClick={() => navigate('/campaigns')} className="bg-primary hover:bg-primary-dark text-white">
                            Back to Campaigns
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center p-4">
            <Card className="max-w-lg w-full shadow-2xl border-t-4 border-t-primary">
                <CardHeader className="text-center p-4 md:p-6 bg-primary-light border-b border-primary/10">
                    <div className="mx-auto w-16 h-16 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg animate-in zoom-in-0 duration-500">
                        <CheckCircle className="h-10 w-10 md:h-16 md:w-16 text-white" />
                    </div>
                    <CardTitle className="text-xl min-[350px]:text-2xl md:text-3xl font-extrabold text-primary leading-tight">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6 text-center p-4 md:p-6 pt-6">
                    <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                        Thank you for your generous donation! Your payment has been processed successfully.
                    </p>

                    <div className="bg-primary-light rounded-lg p-4 border border-primary/20">
                        <div className="flex items-center justify-center gap-3 text-primary-dark">
                            <Mail className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-semibold text-center leading-tight">
                                A receipt has been generated and will be available in your dashboard
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            className="w-full bg-primary hover:bg-primary-dark text-white shadow-md flex items-center justify-center gap-2"
                            onClick={() => navigate('/user/dashboard')}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            View Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary-light flex items-center justify-center gap-2"
                            onClick={() => navigate('/campaigns')}
                        >
                            <Target className="h-4 w-4" />
                            Make Another Donation
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground pt-4 italic">
                        May Allah accept your donation and reward you abundantly.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}