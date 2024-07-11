import {z} from 'zod'

export const emailValidation = z
    .string()
    .email({
        message: 'Invalid email address'
    })

export const waitListSchema = z.object({
    email: emailValidation
})