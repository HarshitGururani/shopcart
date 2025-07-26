import axios from "axios";
import { registerSchema } from "./(auth)/register/page";
import z from "zod";
import { loginSchema } from "./(auth)/login/page";

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const registerUser= async (formData:z.infer<typeof registerSchema>)=>{
  try {
    const response = await apiClient.post('/auth/register',formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const loginUser = async(formData:z.infer<typeof loginSchema>) => {
  try {
    const response = await apiClient.post('/auth/login',formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getUserDetails = async()=>{
  try {
    const response = await apiClient.get('/auth/user')
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateUserProfile = async (userData: {
  name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) => {
  try {
    const response = await apiClient.put('/auth/user', userData)
    return response.data
  } catch (error) {
    throw error
  }
}


