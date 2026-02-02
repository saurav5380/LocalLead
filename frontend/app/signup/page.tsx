"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { UserPlus } from 'lucide-react';

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailId, setEmailId] = useState("");
    const [fullname, setFullname] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const user_data = {
            "email": emailId,
            "username": username,
            "password": password,
            "fullname": fullname
        }

        try {
            const response = await axios.post("http://localhost:8000/signup", user_data);
            console.log("User created successfully:", response.data);
            // Redirect to login page after successful signup
            router.push('/login');
        } catch (error: any) {
            console.error("Error: ", error.message);
            const errorMessage = error.response?.data?.detail || error.message || "Signup failed. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <nav className="border-b border-border bg-surface/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            LocalLead
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <UserPlus className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                            <p className="text-text-secondary">Join LocalLead and start managing leads</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-error/10 border-2 border-error rounded-lg p-4 mb-6">
                                <p className="text-error text-sm">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-foreground mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="fullname"
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg text-foreground placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                    placeholder="Create a password (min 8 chars)"
                                    required
                                />
                                <p className="mt-2 text-xs text-text-tertiary">
                                    Password should contain an uppercase letter, a number, and be at least 8 characters
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-medium px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-text-secondary text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
