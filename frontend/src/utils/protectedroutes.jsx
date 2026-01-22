import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() =>{
        async function checkUser() {
            const { data: {user} } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        }

        checkUser();
    }, []);
    if (isAuthenticated === null){
        return;
    }
    if (!isAuthenticated){
        return <Navigate to="/" replace />;
    }
    return children
}