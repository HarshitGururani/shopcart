'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import registerImage from '@/assets/signup-image.jpg'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerUser } from '@/app/apiClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long'}),
})


const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {register,handleSubmit,formState:{errors}} = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  })
  
  const onSubmit = handleSubmit(async (formData:z.infer<typeof registerSchema>)=>{
    try {
      setIsLoading(true);
      setError('');
      const response = await registerUser(formData);
      toast.success('User registered successfully');
      router.push('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError('Email already registered. Please use a different email or try logging in.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  })

  return (
    <div className='flex items-center justify-center h-screen bg-background'>
      <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr] max-w-6xl w-full h-auto shadow-xl rounded-3xl'>     
          <div className='flex flex-col p-10 bg-white rounded-tl-3xl rounded-bl-3xl space-y-4'>
            <h1 className='text-3xl font-bold text-center mb-6'>Create an account</h1>
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}
            <form className='flex flex-col gap-4' onSubmit={onSubmit}>
              <div className='flex flex-col gap-2'>
                <Label>Name</Label>
                <Input type='text' placeholder='Enter your name'{ ...register('name')} />
                {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Email</Label>
                <Input type='email' placeholder='Enter your email'{ ...register('email')} />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Password</Label>
                <div className='relative'>
                  <Input type={showPassword ? 'text' : 'password'} placeholder='Enter your password'{ ...register('password')} />
                  {
                    showPassword ? (
                      <EyeIcon className='size-5 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground' onClick={()=>setShowPassword(!showPassword)}/>
                    ):(
                      <EyeOffIcon className='size-5 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground' onClick={()=>setShowPassword(!showPassword)}/>
                    )
                  }                 
                </div>
                {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
              </div>
              <Button type='submit' className='mt-4' disabled={isLoading}>
              {isLoading && <Loader2 className='size-5 animate-spin' />}
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <p className='text-center text-sm text-muted-foreground'>Already have an account? <Link href='/login' className='text-primary hover:underline'>Login</Link></p>
            </form>
          </div>
          <div className='hidden md:block rounded-tl-3xl rounded-bl-3xl overflow-hidden'>
            <Image src={registerImage} alt='register' className='w-full h-full object-cover'/>
          </div>
       </div>
    </div>
  )
}

export default page