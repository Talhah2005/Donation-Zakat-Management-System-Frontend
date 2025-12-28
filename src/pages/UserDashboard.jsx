// UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function UserDashboard() {
    const { userId } = useParams();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, [userId]);

    const fetchDashboard = async () => {
        try {
            const response = await api.get(`/dashboard/user/${userId}`);
            setDashboard(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReceipt = async (receiptId) => {
        try {
            const token = localStorage.getItem('token');
            window.open(`http://localhost:5000/api/receipts/download/${receiptId}?token=${token}`, '_blank');
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
            <div className="container mx-auto px-2 md:px-4 py-8">
                <h1 className="text-2xl min-[350px]:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-foreground leading-tight">My Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-t-4 border-t-primary shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Total Donations</CardDescription>
                                <TrendingUp className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary">{dashboard?.statistics.totalDonations}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-t-4 border-t-primary shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Total Amount</CardDescription>
                                <DollarSign className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary whitespace-nowrap">
                                <span className="text-sm mr-1">Rs.</span>
                                {dashboard?.statistics.totalAmount.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-t-4 border-t-primary shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Verified</CardDescription>
                                <CheckCircle className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary">{dashboard?.statistics.verifiedDonations}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-t-4 border-t-warning shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Pending</CardDescription>
                                <Clock className="h-4 w-4 text-warning opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-warning">{dashboard?.statistics.pendingDonations}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Donations by Type */}
                <Card className="mb-8 shadow-lg bg-white border-t-4 border-t-primary">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-xl md:text-2xl text-foreground">Donations by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {Object.entries(dashboard?.statistics.donationsByType || {}).map(([type, amount]) => (
                                <div key={type} className="text-center p-3 md:p-4 bg-primary-light rounded-lg border border-primary/20">
                                    <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">{type}</p>
                                    <p className="text-lg md:text-2xl font-bold text-primary">Rs. {amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Donation History */}
                <Card className="shadow-lg bg-white border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-foreground">Donation History</CardTitle>
                        <CardDescription>All your donations and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-primary">
                                        <th className="text-left p-3 font-semibold text-foreground">Date</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Amount</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Type</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Category</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Campaign</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Status</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard?.donations.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-8 text-muted-foreground">
                                                No donations yet
                                            </td>
                                        </tr>
                                    ) : (
                                        dashboard?.donations.map((donation) => (
                                            <tr key={donation._id} className="border-b hover:bg-primary-light transition-colors">
                                                <td className="p-3">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 font-bold text-primary">Rs. {donation.amount.toLocaleString()}</td>
                                                <td className="p-3">{donation.type}</td>
                                                <td className="p-3">{donation.category}</td>
                                                <td className="p-3">{donation.campaignId?.name || 'General'}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${donation.status === 'Verified'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-warning text-white'
                                                        }`}>
                                                        {donation.status === 'Verified' ? (
                                                            <CheckCircle className="h-3 w-3" />
                                                        ) : (
                                                            <Clock className="h-3 w-3" />
                                                        )}
                                                        {donation.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {donation.receiptId && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => downloadReceipt(donation.receiptId._id)}
                                                            className="border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-1"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            Download
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}