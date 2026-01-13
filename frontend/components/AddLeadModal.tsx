"use client"

import { useState, useRef } from "react";

export default function AddLeadModal(){
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null> ("new");
    return (
        <>
        
        </>
    )
}



