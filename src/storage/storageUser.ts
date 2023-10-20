import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from '@dtos/UserDTO';
import { USER_STORAGE } from './storageConfig';

export async function storageUserSave( user:UserDTO ) {
   await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageGetUser(){
   const res = await AsyncStorage.getItem(USER_STORAGE);

   const user : UserDTO = res ? JSON.parse(res) : {}

   return user
}

export async function storageRemoveUser() {
   await AsyncStorage.removeItem(USER_STORAGE);
}