//Home.jsx
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CreditCard, Target, FileText, Rocket, HandHeart, User, Receipt, Coins } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 bg-primary text-white rounded-full mb-4 shadow-md max-w-full overflow-hidden">
                        <HandHeart className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="font-semibold text-xs md:text-base whitespace-nowrap">Transforming Lives Through Giving</span>
                    </div>

                    <h1 className="text-3xl min-[350px]:text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
                        Saylani Welfare Trust
                    </h1>
                    <h2 className="text-xl min-[350px]:text-2xl md:text-3xl font-bold text-primary leading-snug">
                        Donation & Zakat Management
                    </h2>

                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                        A complete platform for managing donations, tracking campaigns, and making a difference in the community.
                    </p>

                    <div className="flex flex-col min-[450px]:flex-row gap-3 justify-center pt-4 w-full max-w-[400px] mx-auto min-[450px]:max-w-none">
                        <Link to="/signup" className="w-full min-[450px]:w-auto">
                            <Button size="lg" className="w-full bg-primary hover:bg-primary-dark text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg shadow-lg flex items-center justify-center gap-2 border-0">
                                <Rocket className="h-4 w-4 md:h-5 md:w-5" />
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/campaigns" className="w-full min-[450px]:w-auto">
                            <Button size="lg" variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary-light px-6 md:px-8 py-4 md:py-6 text-base md:text-lg flex items-center justify-center gap-2">
                                <Target className="h-4 w-4 md:h-5 md:w-5" />
                                Campaigns
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-primary bg-white">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 shadow-md">
                                <CreditCard className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Easy Donations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Make donations easily with multiple payment options: Cash, Bank Transfer, or Online Payment via Stripe for secure transactions.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-primary bg-white">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 shadow-md">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Campaign Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Support specific campaigns like Ramadan, Flood Relief, Education, and more with transparent goal tracking and real-time updates.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-primary bg-white">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 shadow-md">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Auto Receipts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Get instant PDF receipts for all your donations with complete transaction details for your records and tax purposes.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 mb-16">
                    <h2 className="text-2xl min-[350px]:text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 min-[350px]:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { num: 1, title: 'Sign Up', desc: 'Create account', Icon: User },
                            { num: 2, title: 'Choose', desc: 'Browse campaigns', Icon: Target },
                            { num: 3, title: 'Donate', desc: 'Select & pay', Icon: Coins },
                            { num: 4, title: 'Receipt', desc: 'Download PDF', Icon: Receipt }
                        ].map((step) => (
                            <div key={step.num} className="text-center group">
                                <div className="relative mb-4 inline-block">
                                    <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                                        {step.num}
                                    </div>
                                    <div className="absolute -top-1 -right-2">
                                        <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-primary/20">
                                            <step.Icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-base md:text-xl mb-1 text-foreground">{step.title}</h3>
                                <p className="text-muted-foreground text-[10px] md:text-sm uppercase tracking-wide">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-primary rounded-2xl p-6 md:p-12 text-white shadow-2xl">
                    <h2 className="text-2xl min-[350px]:text-3xl font-bold mb-4 leading-tight text-white">Ready to Make a Difference?</h2>
                    <p className="text-sm md:text-xl mb-8 opacity-95">Join thousands of donors helping communities across Pakistan</p>
                    <Link to="/signup">
                        <Button size="lg" className="w-full min-[450px]:w-auto bg-white text-primary hover:bg-white/90 px-8 py-4 md:py-6 text-base md:text-lg shadow-xl flex items-center justify-center gap-2 mx-auto border-0 font-bold">
                            Start Now
                            <Rocket className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}