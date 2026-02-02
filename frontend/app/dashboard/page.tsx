"use client"

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Users, UserPlus, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import AddLeadModal from "@/components/AddLeadModal";
import EditLeadModal from "@/components/EditLeadModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import StatCard from "@/components/StatCard";
import FilterButtons from "@/components/FilterButtons";


interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const Dashboard = () => {
    const [token, setToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [leads, setLeads] = useState<Lead[]>([])
    const [error, setError] = useState<string | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const stored_token  = localStorage.getItem("token");
        if(!stored_token){
            router.push("/login");
            return
        }
        setToken(stored_token);
    },[router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const refreshLeads = async () => {
        if (!token) return;

        try {
            const tokenConfig = {
                headers: { "Authorization": `Bearer ${token}` }
            };
            const response = await axios.get(
                "http://localhost:8000/getleads",
                tokenConfig
            );
            setLeads(response.data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(()=> {

        if (!token) return;

        const tokenConfig = {
            headers: {"Authorization": `Bearer ${token}`}
        }
        const fetchData = async () => {
            try {
               const response = await axios.get("http://localhost:8000/getleads",tokenConfig);
               const result = response.data;
               setLeads(result)
            }
            catch(err: any) {
                setError(err.message);
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchData();
    },[token])

    const getStatistics = () => {
        const total = leads.length;
        const newLeads = leads.filter(l => l.status === "new").length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const wonThisMonth = leads.filter(l => {
            const createdDate = new Date(l.created_at);
            return l.status === "won"
                && createdDate.getMonth() === currentMonth
                && createdDate.getFullYear() === currentYear;
        }).length;

        const lostThisMonth = leads.filter(l => {
            const createdDate = new Date(l.created_at);
            return l.status === "lost"
                && createdDate.getMonth() === currentMonth
                && createdDate.getFullYear() === currentYear;
        }).length;

        return { total, newLeads, wonThisMonth, lostThisMonth };
    };

    const handleDelete = async (leadId: number) => {
        setIsDeleting(true);

        try {
            const tokenConfig = {
                headers: { "Authorization": `Bearer ${token}` }
            };

            await axios.delete(
                `http://localhost:8000/deletelead/${leadId}`,
                tokenConfig
            );

            setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
            setShowDeleteModal(false);
            setSelectedLead(null);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to delete lead");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (leadId: number, newStatus: string) => {
        try {
            const tokenConfig = {
                headers: { "Authorization": `Bearer ${token}` }
            };

            // Optimistic update
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === leadId
                        ? { ...lead, status: newStatus }
                        : lead
                )
            );

            await axios.patch(
                `http://localhost:8000/patchlead/${leadId}`,
                { status: newStatus },
                tokenConfig
            );
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to update status");
            refreshLeads();
        }
    };

    const filteredLeads = activeFilter === "all"
        ? leads
        : leads.filter(lead => lead.status === activeFilter);

    const stats = getStatistics(); 


    if (isLoading){
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-2xl text-slate-300">Loading...</div>
        </div>
    }

    if (error){
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-xl text-red-400">Error: {error}</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-violet-500 px-4 py-2 rounded-lg text-lg hover:bg-violet-600 transition"
                    >
                        Add New Lead
                    </button>
                    <button
                        onClick={handleLogout}
                        className="border-2 text-yellow-100 border-amber-400 px-4 py-2 rounded-lg hover:border-amber-600 hover:text-amber-500 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Leads"
                    value={stats.total}
                    icon={<Users size={24} />}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="New Leads"
                    value={stats.newLeads}
                    icon={<UserPlus size={24} />}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Won This Month"
                    value={stats.wonThisMonth}
                    icon={<TrendingUp size={24} />}
                    colorClass="bg-green-500"
                />
                <StatCard
                    title="Lost This Month"
                    value={stats.lostThisMonth}
                    icon={<TrendingDown size={24} />}
                    colorClass="bg-red-500"
                />
            </div>

            {/* Filter Buttons */}
            <div className="mb-6">
                <FilterButtons
                    leads={leads}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            </div>

            {/* Table Section */}
            {leads.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-2 border-slate-700 rounded-lg">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-left">Phone</th>
                                <th className="px-6 py-4 text-left">Company</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => (
                                <tr
                                    key={lead.id}
                                    className="border-t border-slate-700 hover:bg-slate-800 transition"
                                >
                                    <td className="px-6 py-4">{lead.name}</td>
                                    <td className="px-6 py-4">{lead.email || "N/A"}</td>
                                    <td className="px-6 py-4">{lead.phone || "N/A"}</td>
                                    <td className="px-6 py-4">{lead.company_name || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className="bg-slate-700 border-2 border-slate-600 rounded px-2 py-1 focus:border-blue-500 outline-none"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="won">Won</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 bg-red-500 rounded hover:bg-red-600 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-xl text-slate-400 py-12">
                    No leads found. Click "Add New Lead" to get started.
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <AddLeadModal
                    onClose={() => setShowModal(false)}
                    onSuccess={refreshLeads}
                    userToken={token}
                />
            )}

            {showEditModal && selectedLead && (
                <EditLeadModal
                    lead={selectedLead}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedLead(null);
                    }}
                    onSuccess={refreshLeads}
                    userToken={token}
                />
            )}

            {showDeleteModal && selectedLead && (
                <DeleteConfirmModal
                    leadName={selectedLead.name}
                    leadId={selectedLead.id}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedLead(null);
                    }}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}

export default Dashboard;
