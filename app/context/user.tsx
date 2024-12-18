"use client"

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useCreateProfile from '../hooks/useCreateProfile';
import useGetProfileByUserId from '../hooks/useGetProfileByUserId';
import { User, UserContextTypes } from '../types';
const UserContext = createContext<UserContextTypes | null>(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);

  const decodeJWT = (token: string) => {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  }

  const checkUser = async () => {
    try {
      // const currentSession = await account.getSession("current");
      // if (!currentSession) return

      // const promise = await account.get() as any
      const userId = localStorage.getItem('userId');
      if (userId) {
        const profile = await useGetProfileByUserId(userId)
        setUser({ id: userId, name: profile?.name, bio: profile?.bio, image: profile?.image });
      }

    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => { checkUser() }, []);

  const register = async (name: string, email: string, password: string) => {

    try {
      // const promise = await account.create(ID.unique(), email, password, name)
      // await account.createEmailSession(email, password);
      //await useCreateProfile(promise?.$id, name, String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEAFULT_IMAGE_ID), '')
      await useCreateProfile(email, password);
      await checkUser()

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // await account.createEmailSession(email, password);
      const params = {
        email: email,
        password: password
      }
      const response = await axios.post(`${API_URL}/auth/login`, params);
      if (response.data.status === 200) {

        const token = response.data.data.token;

        localStorage.setItem('token', token);
        const decoded = decodeJWT(token);
        const userId = decoded.sub;
        localStorage.setItem('userId', userId);
      }
      checkUser();
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.refresh()
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext)
