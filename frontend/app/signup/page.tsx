"use client"

import { useState } from "react";
import axios from "axios";


function Signup(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailId, setEmailId] = useState("");
    const [fullname, setFullname] = useState("");
    
    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        const user_data = {
            "email": emailId,
            "username": username,
            "password": password,
            "fullname": fullname
        }
        axios.post("http://localhost:8000/signup",user_data).then((response) => {
                console.log("User created successully:", response.data);
                alert("User creation success.")
        }).
        catch((error) => {
            console.error("Error: ", error.message);
        })
    }

    return (
        <>
        <div className="border-2 rounded border-white m-6 p-6">
        <h1 className="text-2xl border-2 text-center  border-purple-200 rounded-lg text-purple-200 p-4 mx-auto my-2 w-xl">Welcome to LocalLead</h1>
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="fullname" className="w-48 text-xl text-white tracking-wide">Enter Full Name</label>
                    <input className="w-80 border-2 border-sky-300 px-3 py-2 rounded"
                    id="fullname" type="text" value={fullname}
                    onChange={(e) => setFullname(e.target.value)}/>
                </div>
                
                <div className="flex items-center gap-4">
                    <label htmlFor="username" className="w-48 text-xl text-white tracking-wide">Create Username</label>
                    <input className="w-80 border-2 border-sky-300 px-3 py-2 rounded" 
                    id="username" type="text" value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                </div>
                
                <div className="flex items-center gap-4">
                    <label htmlFor="password" className="w-48 text-xl text-white tracking-wide">Create Password</label>
                    <input className="w-80 border-2 border-sky-300 px-3 py-2 rounded"
                    id="password" type="password" value={password}
                    placeholder="Password should contain an UpperCase letter, a number and should be minimum 8 characters length"
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                </div>
                
                <div className="flex items-center gap-4">
                    <label htmlFor="email" className="w-48 text-xl text-white tracking-wide">Enter Email Id</label>
                    <input className="w-80 border-2 border-sky-300 px-3 py-2 rounded"
                    id="email" type="email" value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    required/>
                </div>
                <button type="submit" className="mx-auto w-40 border-2 border-purple-200 text-purple-300 px-3 py-2 rounded self-start hover:bg-purple-600 hover:text-white transition">Submit</button>
            </div>
        </form>
        </div>
        </>
    )
}


export default Signup;
