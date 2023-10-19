import { UserDTO } from "@dtos/UserDTO";
import { ReactNode, createContext, useState } from "react";

export type AuthContextDataProps = {
   user: UserDTO;
   setUser: (user:UserDTO) => void;
}

type AuthContextProviderProps = {
   children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider ( { children } : AuthContextProviderProps ) {

   const [user, setUser] = useState({
      id: '1',
      name: 'Matthews Britto',
      email: 'batatinhafrita@hotmail.com',
      avatar:'batata.png'
   }); 

   return (

      <AuthContext.Provider value={ { user, setUser }}>

         { children }

      </AuthContext.Provider>
   )
}