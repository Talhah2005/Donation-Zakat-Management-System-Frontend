// AdminDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Plus, Download, Search, CheckCircle, Clock, TrendingUp, DollarSign, Users, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', search: '' });

    // Campaign creation state
    const [showCampaignForm, setShowCampaignForm] = useState(false);
    const [campaignData, setCampaignData] = useState({
        name: '',
        description: '',
        goalAmount: '',
        deadline: ''
    });

    useEffect(() => {
        fetchDashboard();
        fetchDonations();
    }, []);

    const downloadReceipt = async (receiptId) => {
        try {
            const token = localStorage.getItem('token');
            const baseURL = api.defaults.baseURL.replace('/api', '');
            window.open(`${baseURL}/api/receipts/download/${receiptId}?token=${token}`, '_blank');
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/dashboard/admin');
            setDashboard(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        try {
            const queryParams = new URLSearchParams(filter);
            const response = await api.get(`/donations?${queryParams}`);
            setDonations(response.data.data.donations);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const updateDonationStatus = async (donationId, newStatus) => {
        try {
            await api.patch(`/donations/${donationId}/status`, { status: newStatus });
            fetchDonations();
            fetchDashboard();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const createCampaign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/campaigns', campaignData);
            setShowCampaignForm(false);
            setCampaignData({ name: '', description: '', goalAmount: '', deadline: '' });
            fetchDashboard();
            toast.success('Campaign created successfully');
        } catch (error) {
            console.error('Error creating campaign:', error);
            toast.error(error.response?.data?.message || 'Failed to create campaign');
        }
    };

    const deleteCampaign = async (campaignId) => {
        try {
            await api.delete(`/campaigns/${campaignId}`);
            toast.success('Campaign deleted successfully');
            fetchDashboard();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error.response?.data?.message || 'Failed to delete campaign');
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
                <div className="flex flex-col min-[500px]:flex-row justify-between items-start min-[500px]:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-2xl min-[350px]:text-3xl md:text-4xl font-bold text-foreground leading-tight">Admin Dashboard</h1>
                    <Button onClick={() => setShowCampaignForm(true)} className="w-full min-[500px]:w-auto bg-primary hover:bg-primary-dark text-white shadow-md flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Campaign
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8">
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
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Total Donors</CardDescription>
                                <Users className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary">{dashboard?.statistics.totalDonors}</CardTitle>
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

                    <Card className="border-t-4 border-t-primary shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Verified</CardDescription>
                                <CheckCircle className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary">{dashboard?.statistics.verifiedDonations}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-t-4 border-t-primary shadow-lg bg-white h-full">
                        <CardHeader className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="text-xs font-medium uppercase tracking-wider">Active Campaigns</CardDescription>
                                <TrendingUp className="h-4 w-4 text-primary opacity-70" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-primary">{dashboard?.statistics.activeCampaigns}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Campaigns */}
                <Card className="mb-8 shadow-lg bg-white border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-foreground">Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dashboard?.campaigns.map((campaign) => (
                                <div key={campaign._id} className="p-4 border-2 border-primary/20 rounded-lg hover:shadow-md transition-shadow bg-primary-light flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete <span className="font-semibold cursor-pointer">{campaign.name}</span>? This action cannot be undone and will remove all associated campaign data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteCampaign(campaign._id)}
                                                            className="bg-destructive hover:bg-destructive/90 text-white"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Raised: <span className="font-semibold text-primary">Rs. {campaign.currentAmount.toLocaleString()}</span></span>
                                            <span className="text-muted-foreground">Goal: <span className="font-semibold text-foreground">Rs. {campaign.goalAmount.toLocaleString()}</span></span>
                                        </div>
                                        <div className="w-full bg-white rounded-full h-3 mt-2">
                                            <div
                                                className="bg-primary h-3 rounded-full shadow-sm"
                                                style={{ width: `${Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Donations Management */}
                <Card className="shadow-lg bg-white border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-foreground">All Donations</CardTitle>
                        <CardDescription>Manage and verify donations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex gap-4 mb-4 flex-wrap">
                            <Select
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="border-primary/30 focus:border-primary"
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Verified">Verified</option>
                            </Select>

                            <Input
                                placeholder="Search by donor name..."
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                className="border-primary/30 focus:border-primary flex-1 min-w-[200px]"
                            />

                            <Button onClick={fetchDonations} className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Filter
                            </Button>
                        </div>

                        {/* Donations Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-primary">
                                        <th className="text-left p-3 font-semibold text-foreground">Date</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Donor</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Amount</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Type</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Payment</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Status</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Action</th>
                                        <th className="text-left p-3 font-semibold text-foreground">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center p-8 text-muted-foreground">
                                                No donations found
                                            </td>
                                        </tr>
                                    ) : (
                                        donations.map((donation) => (
                                            <tr key={donation._id} className="border-b hover:bg-primary-light transition-colors">
                                                <td className="p-3">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            {donation.userId?.name || donation.receiptId?.donorName || 'Donor'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{donation.userId?.email || 'Authenticated Donation'}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-bold text-primary">Rs. {donation.amount.toLocaleString()}</td>
                                                <td className="p-3">{donation.type}</td>
                                                <td className="p-3">{donation.paymentMethod}</td>
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
                                                    {donation.status === 'Pending' && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-primary hover:bg-primary-dark text-white flex items-center gap-1"
                                                                >
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Verify
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Verify Donation?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to mark this donation from <span className="font-semibold">{donation.userId?.name || donation.receiptId?.donorName || 'this donor'}</span> as Verified? This action will update the donor's dashboard and campaign totals.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => updateDonationStatus(donation._id, 'Verified')}
                                                                        className="bg-primary hover:bg-primary-dark"
                                                                    >
                                                                        Confirm Verification
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}

                                                    {donation.status === 'Verified' && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-muted-foreground hover:text-destructive flex items-center gap-1"
                                                                >
                                                                    <Clock className="h-3 w-3" />
                                                                    Revert
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Revert to Pending?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to change this donation from <span className="font-semibold">{donation.userId?.name || donation.receiptId?.donorName || 'this donor'}</span> back to Pending? This will decrement the campaign total.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => updateDonationStatus(donation._id, 'Pending')}
                                                                        className="bg-destructive hover:bg-destructive/90 text-white"
                                                                    >
                                                                        Confirm Revert
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
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

                {/* Campaign Creation Modal */}
                {showCampaignForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md shadow-2xl bg-white border-t-4 border-t-primary">
                            <CardHeader className="bg-primary-light border-b border-border">
                                <CardTitle className="text-foreground">Create New Campaign</CardTitle>
                            </CardHeader>
                            <form onSubmit={createCampaign}>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Campaign Name</Label>
                                        <Input
                                            id="name"
                                            value={campaignData.name}
                                            onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                                            required
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={campaignData.description}
                                            onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                                            required
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="goalAmount">Goal Amount (Rs.)</Label>
                                        <Input
                                            id="goalAmount"
                                            type="number"
                                            value={campaignData.goalAmount}
                                            onChange={(e) => setCampaignData({ ...campaignData, goalAmount: e.target.value })}
                                            required
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deadline">Deadline</Label>
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={campaignData.deadline}
                                            onChange={(e) => setCampaignData({ ...campaignData, deadline: e.target.value })}
                                            required
                                            className="border-primary/30 focus:border-primary"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white">
                                            Create Campaign
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setShowCampaignForm(false)} className="border-primary text-primary hover:bg-primary-light">
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