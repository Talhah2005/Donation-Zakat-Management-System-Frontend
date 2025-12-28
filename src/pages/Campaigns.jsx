//Campaigns.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { Heart, DollarSign, Building2, CreditCard, Lock, Info } from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDonationForm, setShowDonationForm] = useState(false);
    const { user } = useAuth();

    // Donation form state
    const [donationData, setDonationData] = useState({
        amount: '',
        type: 'General',
        category: 'Food',
        paymentMethod: 'Cash'
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaigns/active');
            setCampaigns(response.data.data.campaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDonateClick = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDonationForm(true);
    };

    const handleDonationSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const donationPayload = {
                ...donationData,
                amount: Number(donationData.amount),
                campaignId: selectedCampaign?._id
            };

            // Check if payment method requires Stripe checkout
            if (donationData.paymentMethod === 'Online' || donationData.paymentMethod === 'Bank') {
                // Create Stripe checkout session
                const response = await api.post('/payment/create-checkout-session', {
                    amount: Number(donationData.amount),
                    donationData,
                    campaignId: selectedCampaign?._id
                });

                // Redirect to Stripe Checkout
                if (response.data.data.url) {
                    toast.info('Redirecting to secure payment page...');
                    window.location.href = response.data.data.url;
                }
            } else {
                // For Cash, create donation directly
                const response = await api.post('/donations', donationPayload);

                toast.success('Donation successful! Thank you for your support.');
                setDonationData({ amount: '', type: 'General', category: 'Food', paymentMethod: 'Cash' });
                setShowDonationForm(false);
                setSelectedCampaign(null);
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Donation error:', error);
            const errorMsg = error.response?.data?.message || 'Error creating payment';
            toast.error(errorMsg);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
            <div className="container mx-auto px-2 md:px-4 py-8">
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-2xl min-[350px]:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">Active Campaigns</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Choose a campaign to support and make a difference</p>
                </div>


                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground text-lg">No active campaigns at the moment.</p>
                        </div>
                    ) : (
                        campaigns.map((campaign) => {
                            const progress = (campaign.currentAmount / campaign.goalAmount) * 100;

                            return (
                                <Card key={campaign._id} className="hover:shadow-2xl transition-shadow border-t-4 border-t-primary bg-white">
                                    <CardHeader className="p-4 md:p-6">
                                        <CardTitle className="text-lg md:text-xl text-foreground font-bold">{campaign.name}</CardTitle>
                                        <CardDescription className="text-xs md:text-sm line-clamp-2">{campaign.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 md:p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-semibold text-primary">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-3">
                                                    <div
                                                        className="bg-primary h-3 rounded-full transition-all shadow-sm"
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-3 md:gap-4 text-sm">
                                                <div className="bg-primary-light p-3 rounded-lg flex flex-col justify-center">
                                                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Raised</p>
                                                    <p className="font-bold text-primary text-sm md:text-base">Rs. {campaign.currentAmount.toLocaleString()}</p>
                                                </div>
                                                <div className="bg-primary-light p-3 rounded-lg flex flex-col justify-center">
                                                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Goal</p>
                                                    <p className="font-bold text-foreground text-sm md:text-base">Rs. {campaign.goalAmount.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="text-sm bg-secondary p-3 rounded-lg">
                                                <p className="text-muted-foreground text-xs">Deadline</p>
                                                <p className="font-semibold text-foreground">{new Date(campaign.deadline).toLocaleDateString()}</p>
                                            </div>

                                            <Button className="w-full bg-primary hover:bg-primary-dark text-white shadow-md flex items-center justify-center gap-2" onClick={() => handleDonateClick(campaign)}>
                                                <Heart className="h-4 w-4" />
                                                Donate Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Donation Form Modal */}
                {showDonationForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 min-[400px]:p-4 z-50">
                        <Card className="w-full max-w-md max-h-[95vh] overflow-y-auto bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                            <CardHeader className="bg-primary-light border-b border-border p-4 min-[400px]:p-6">
                                <CardTitle className="text-lg min-[400px]:text-xl text-foreground font-bold leading-tight">Make a Donation</CardTitle>
                                <CardDescription className="text-xs min-[400px]:text-sm mt-1">
                                    {selectedCampaign ? `Campaign: ${selectedCampaign.name}` : 'General Donation'}
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleDonationSubmit}>
                                <CardContent className="space-y-4 pt-4 min-[400px]:pt-6 p-4 min-[400px]:p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (Rs.)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={donationData.amount}
                                            onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                                            required
                                            min={donationData.paymentMethod === 'Online' || donationData.paymentMethod === 'Bank' ? '150' : '1'}
                                            placeholder="Enter amount"
                                            className="border-primary/30 focus:border-primary"
                                        />
                                        {(donationData.paymentMethod === 'Online' || donationData.paymentMethod === 'Bank') && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                Minimum Rs. 150 for online/bank payments
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Donation Type</Label>
                                        <Select
                                            id="type"
                                            value={donationData.type}
                                            onChange={(e) => setDonationData({ ...donationData, type: e.target.value })}
                                            className="border-primary/30 focus:border-primary"
                                        >
                                            <option value="Zakat">Zakat</option>
                                            <option value="Sadqah">Sadqah</option>
                                            <option value="Fitra">Fitra</option>
                                            <option value="General">General</option>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            id="category"
                                            value={donationData.category}
                                            onChange={(e) => setDonationData({ ...donationData, category: e.target.value })}
                                            className="border-primary/30 focus:border-primary"
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Education">Education</option>
                                            <option value="Medical">Medical</option>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="paymentMethod">Payment Method</Label>
                                        <Select
                                            id="paymentMethod"
                                            value={donationData.paymentMethod}
                                            onChange={(e) => setDonationData({ ...donationData, paymentMethod: e.target.value })}
                                            className="border-primary/30 focus:border-primary"
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Bank">Bank Transfer</option>
                                            <option value="Online">Online Payment (Stripe)</option>
                                        </Select>
                                    </div>

                                    {/* Show info based on payment method */}
                                    {(donationData.paymentMethod === 'Online' || donationData.paymentMethod === 'Bank') && (
                                        <div className="bg-primary-light border border-primary rounded-md p-3 text-sm">
                                            <p className="text-primary-dark font-medium flex items-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                You'll be redirected to Stripe's secure payment page
                                            </p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {donationData.paymentMethod === 'Bank'
                                                    ? 'Pay securely via bank transfer through Stripe'
                                                    : 'Pay securely with your card through Stripe'}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2" disabled={submitting}>
                                            {submitting ? 'Processing...' :
                                                donationData.paymentMethod === 'Online' ? (
                                                    <>
                                                        <Lock className="h-4 w-4" />
                                                        Pay with Stripe
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign className="h-4 w-4" />
                                                        Submit Donation
                                                    </>
                                                )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowDonationForm(false);
                                                setSelectedCampaign(null);
                                            }}
                                            className="border-primary text-primary hover:bg-primary-light"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}