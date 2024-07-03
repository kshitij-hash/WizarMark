import {z} from 'zod'

export const emailValidation = z
    .string()
    .email({
        message: 'Invalid email address'
    })

export const WaitListSchema = z.object({
    email: emailValidation
})