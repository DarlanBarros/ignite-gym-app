import { ReactNode, createContext, useEffect, useState } from 'react';

import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTO';

import { storageUserGet, storageUserSave, storageUserRemove } from '@storage/storageUser';
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken';

type AuthContextPtoviderProps = {
    children: ReactNode;
}

export type AuthContextDataProps = {
    user: UserDTO;
    loadingStorageData: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextPtoviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [loadingStorageData, setLoadingStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
        } catch(error) {
            throw error;
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });

            if(data.user && data.token ) {
                setLoadingStorageData(true);

                await storageUserSave(data.user);
                await storageAuthTokenSave(data.token);
                userAndTokenUpdate(data.user, data.token);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoadingStorageData(false);
        }
    }

    async function signOut() {
        try {
            setLoadingStorageData(true);
            setUser({} as UserDTO);

            await storageUserRemove();
            await storageAuthTokenRemove();
        } catch (error) {
            throw error;
        } finally {
            setLoadingStorageData(false);
        }
    }

    async function loadUserData() {
        try {
            setLoadingStorageData(true);
            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();

            if(token && userLogged) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch(error) {
            throw error;
        } finally {
            setLoadingStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    },[])

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loadingStorageData }}>
            { children }
          </AuthContext.Provider>
    )
}