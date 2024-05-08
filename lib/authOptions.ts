import {NextAuthOptions} from "next-auth"
import credentials from "next-auth/providers/credentials";


export const authOptions:NextAuthOptions = {
    providers:[Credentials({
        name:"Credentials",
        credentials:{
            email:{},
            password:{},

        },

        async authorize(credentials, req){

        }


    })]
}