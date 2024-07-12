'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

export default function SignInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const { toast } = useToast();
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const repsonse = await axios.post<ApiResponse>('/api/signin', data);

            toast({
                title: 'Sign in successful',
                description: repsonse.data.message
            })

            router.replace('/extension');
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error signing in: ", error);
            const axiosError = error as AxiosError<ApiResponse>;

            let errorMessage = axiosError.response?.data.message ??
            ('An error occurred while signing in');

            toast({
                title: 'Sign in failed',
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg shadow-md border-2">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight lg:text-5xl mb-6">
                        welcome back to <span className='font-extrabold'>wizarmark</span>
                    </h1>
                    <p className="mb-4">sign in to continue managing your bookmarks</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>email/username</FormLabel>
                                    <Input disabled={isSubmitting} placeholder='email/username' {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>password</FormLabel>
                                    <Input disabled={isSubmitting} placeholder='********' type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        signing in...
                                    </>
                                ) : (
                                    'sign in'
                                )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        not a member yet?{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                            sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}