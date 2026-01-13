"use client"

import {useState} from 'react';
import axios from "axios";
import { redirect } from 'next/navigation';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user_data = {
            "username": username,
            "password": password
        }

        axios.post("http://localhost:8000/login",user_data).then((response) => {
            localStorage.setItem('token', response.data.access_token);
            console.log("Login Successful", response.data);
        })
        .catch((error) => {
            console.error("Login Failed due to Error: ", error.message);
        })

    }
    
    return (
        <>
         <h1 className='text-2xl text-yellow-200 border-2 rounded border-slate-300 p-3 m-6 text-center mx-auto block w-fit'>Welcome to User Login</h1>
         <form onSubmit={handleSubmit} className="mx-auto max-w-3xl mt-4">
            <div className="flex flex-col gap-4">
                
                <div className="flex items-center gap-4">
                    <label htmlFor="username" className='w-48 text-xl text-slate-200'>Username</label>
                    <input id="username" type="text" value={username} className="w-80 border-2 rounded-lg border-sky-200 px-3 py-2" onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div className="flex items-center gap-4">
                    <label htmlFor="password" className='w-48 text-xl text-slate-200'>Password</label>
                    <input id="password" type="password" value={password} className="w-80 border-2 rounded-lg border-sky-200 px-3 py-2" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" 
                className='w-40 mx-auto border-2
                 border-purple-400 text-purple-500 px-3 py-2 m-4 rounded 
                 hover:bg-purple-500 hover:text-white transition self-start'
                 onClick={() => redirect("http://localhost:8000/dashboard")}>Submit</button>
            </div>
         </form>
         </>
    )
 }

export default Login;
