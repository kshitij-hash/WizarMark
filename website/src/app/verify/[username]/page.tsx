"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { useParams, useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function VerifyAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace('/signin')
        } catch (error) {
            setIsSubmitting(false);
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Verification Failed',
                description: 
                    axiosError.response?.data.message ?? 
                    'An error occurred. Please try again.',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        verify your account
                    </h1>
                    <p className="mb-4">enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-1/2" type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        verifying...
                                    </>
                                ) : (
                                    'verify'
                                )
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}