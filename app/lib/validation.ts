import { z } from "zod"

export const signupUserInputs = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "username must be at least 3"),
    email: z.email("Please enter valid email address"),
    password: z.string().min(8, "password must be at least 8 character")
})

export const loginInputs = z.object({
    email: z.email("Please enter valid email address"),
    password: z.string().min(8, "Password is required")
})

export const registerFormInput = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.email("Please enter email"),
    password: z.string().min(8, "password must be at least 8 character"),
    username: z.string().min(3, "username must be at least 3")
})

export const logInFormValidation = z.object({
    email: z.email("Please enter your email"),
    password: z.string().min(8, "enter your password")
})