import {z} from 'zod'

export const registerSchema = z.object({
    username : z.string({
        required_error: "username invalido"
    }),
    email: z.string({
        required_error: "email is required"
        }).email({
            message: "invalid email"
        }),
    password: z.string({
        required_error: "password requerida"
    })
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "email is requiored prro"
    }).email({
        menssage: "invalid email"
    }),
    password: z.string({
        required_error: "password is required"
    })

})