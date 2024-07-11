import {z} from 'zod'

const tagSchema = z
    .string()
    .min(2, {message: "Tag must be at least 2 characters long"})
    .max(12, {message: "Tag must be at most 12 characters long"})

export const bookmarkSchema = z.object({
    faviconUrl: z
        .string()
        .min(1, {message: "Favicon URL is required"}),
    title: z
        .string()
        .min(1, {message: "Title is required"}),
    url: z
        .string()
        .min(1, {message: "URL is required"}),
    dateAdded: z.number(),
    tags: z
        .array(tagSchema)
        .min(1, {message: "At least one tag is required"})
        .max(3, {message: "At most three tags are allowed"}),
})