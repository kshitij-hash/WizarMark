'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { waitListSchema } from '../schemas/waitlistSchema'
import { useToast } from './ui/use-toast'
import { useState } from 'react'
import axios, {AxiosError} from 'axios'

export default function WaitlistForm() {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<z.infer<typeof waitListSchema>>({
        resolver: zodResolver(waitListSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof waitListSchema>) => {
        setSubmitting(true)
        try {
            const response = await axios.post('/api/waitlist', data)

            if (response.status === 201) {
                toast({
                    title: 'Success',
                    description: 'You have been added to the waitlist',
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError
            toast({
                title: 'Error',
                description: (axiosError.response?.data as any)?.message || 'Failed to add you to the waitlist',
                variant: 'destructive'
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    disabled={submitting}
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter your email' {...field} />
                            </FormControl>
                            <FormDescription>
                                We&apos;ll notify you when WizarMark is ready for you to try.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={submitting} type='submit'>Join</Button>
            </form>
        </Form>
    )
}