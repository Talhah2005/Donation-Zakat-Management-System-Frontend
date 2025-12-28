// Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { LayoutDashboard, Target, User, LogOut, Menu, X } from 'lucide-react';
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

export default function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const NavLinks = () => (
        <>
            {isAuthenticated() ? (
                <>
                    {isAdmin() ? (
                        <>
                            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start md:w-auto text-foreground hover:text-primary hover:bg-primary-light flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="md:inline">Dashboard</span>
                                </Button>
                            </Link>
                            <Link to="/campaigns" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start md:w-auto text-foreground hover:text-primary hover:bg-primary-light flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    <span className="md:inline">Campaigns</span>
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/campaigns" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start md:w-auto text-foreground hover:text-primary hover:bg-primary-light flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    <span className="md:inline">Campaigns</span>
                                </Button>
                            </Link>
                            <Link to={`/user/dashboard/${user?.id}`} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start md:w-auto text-foreground hover:text-primary hover:bg-primary-light flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="md:inline">Dashboard</span>
                                </Button>
                            </Link>
                        </>
                    )}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:ml-2 md:pl-2 md:border-l border-border w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 text-foreground text-sm font-medium px-4 md:px-0">
                            <User className="h-4 w-4" />
                            <span className="max-w-[100px] truncate">{user?.name}</span>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-start md:justify-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90vw] max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will need to login again to access your dashboard.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogout} className="bg-primary hover:bg-primary-dark">
                                        Logout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            ) : (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
                        <Button variant="ghost" className="w-full text-foreground hover:text-primary hover:bg-primary-light">
                            Login
                        </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
                        <Button className="w-full bg-primary text-white hover:bg-primary-dark shadow-md border-0">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-primary">
            <div className="container mx-auto px-2 md:px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
                        <img
                            src="https://tse1.mm.bing.net/th/id/OIP.NkwEpqJktRs1GVY_474xRQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                            alt="Logo"
                            className="h-10 w-10 md:h-14 md:w-14 object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-base md:text-xl font-bold text-primary leading-tight">Saylani</span>
                            <span className="text-[10px] md:text-xs text-muted-foreground hidden min-[350px]:block">Donation & Zakat</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-primary hover:bg-primary-light rounded-md transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-primary shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top duration-200">
                        <NavLinks />
                    </div>
                )}
            </div>
        </nav>
    );
}
