"use client"

import { useState } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const user_data = {
            "username": username,
            "password": password
        }

        try {
            const response = await axios.post("http://localhost:8000/login", user_data);
            localStorage.setItem('token', response.data.access_token);
            console.log("Login Successful", response.data);
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login Failed due to Error: ", error.message);
            const errorMessage = error.response?.data?.detail || error.message || "Login failed. Please try again.";
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
                                <LogIn className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                            <p className="text-text-secondary">Sign in to your LocalLead account</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-error/10 border-2 border-error rounded-lg p-4 mb-6">
                                <p className="text-error text-sm">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Enter your username"
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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-medium px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-text-secondary text-sm">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-primary hover:text-primary-hover font-medium transition">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
