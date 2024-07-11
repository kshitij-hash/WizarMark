import 'next-auth'
import { DefaultSession } from 'next-auth';
import { decl } from 'postcss';

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
    interface User {
        _id?: string;
        isVerified?: boolean;
        username?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        username?: string;
    }
}