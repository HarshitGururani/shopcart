"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getUserDetails } from "../apiClient";
import toast from "react-hot-toast";
import axios from "axios";



const UserContext = createContext<{user:any,setUser:any,isLoading:boolean,isAdmin:boolean}>({user:null,setUser:()=>{},isLoading:false,isAdmin:false})

export const UserProvider = ({children}:{children:React.ReactNode})=>{
   const [user,setUser] = useState<any>(null);
   const [isLoading,setLoading] = useState(false);
   const [isAdmin,setIsAdmin] = useState(false);
   useEffect(()=> {
      const fetchUser = async()=>{
        try {
          setLoading(true)
          const response = await getUserDetails();
          setUser(response.user);
          setIsAdmin(response.isAdmin);
        } catch (error: any) {
          console.log(error);
          // Don't show error toast for 401 (unauthorized) as user might not be logged in
          if (axios.isAxiosError(error) && error.response?.status !== 401) {
            toast.error("Error fetching user details")
          }
        } finally{
          setLoading(false)
        }  
      }
      fetchUser();
  },[])

  return <UserContext.Provider value={{user,setUser,isLoading,isAdmin}}>{children}</UserContext.Provider>

}


export const useUser = ()=>{
  const userContext = useContext(UserContext);
  if(!userContext){
    throw new Error("useUser must be used within a UserProvider")
  }
  return userContext; 
}