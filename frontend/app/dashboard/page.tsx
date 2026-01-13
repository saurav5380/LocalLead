"use client"

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


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
            catch(err) {
                setError(err.message);
            }
            finally {
                setIsLoading(false)
            }
        }  
        fetchData();
    },[token]) 


    if (isLoading){
        return <div className="text-lg text-slate-300 ">Loading...</div>
    }

    if (error){
        return <div className="text-xl text-slate-300">Error in fetching data..</div>
    }
    
    return (
        <>
        <div>
            <div className="flex items-center justify-center">
                <h1 className="text-xl p-6 text-blue-500 ">User Dashboard</h1>
            </div>
            <button onClick={handleLogout} className="border-2 text-yellow-100 border-amber-400 hover:cursor-pointer hover:border-amber-600 hover:text-amber-500 transition-all">Logout</button>
                <div className="flex flex-col gap-4">
                {leads.length > 0 ? (
                    <div className="flex items-center justify-center">
                    <h3 className="text-xl p-6 text-sky-300">Current Leads</h3>
                    <ul className="border rounded-lg">
                        {leads.map(lead => (
                            <li key={lead.id} className="border-b-2 p-4 mx-2 my-2 max-w-3/4">
                                <div>
                                    <p>Company: {lead.company_name}</p>
                                    <p>Name: {lead.name}</p>
                                    <p>Phone: {lead.phone}</p>
                                    <p>Email: {lead.email}</p>
                                    <p>Status: {lead.status}</p>
                                </div>
                            </li>
                        ))}

                    </ul>
                    </div>
            ) : <h3>You have no leads stored..</h3>}
            </div>
        </div>
        </>
    )
}

export default Dashboard;
