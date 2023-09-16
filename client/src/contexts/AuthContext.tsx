import React, { useState } from 'react';
import { FC, createContext, useContext } from 'react';

const AuthContext = createContext({
    accessToken: '',
    setAccessToken: (token: string) => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>('');

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
