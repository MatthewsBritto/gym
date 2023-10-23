import { VStack, ScrollView, Center, Skeleton, Text, Heading, useToast } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import ScreenHeader from '@components/ScreenHeader';
import UserPhoto from '@components/UserPhoto';
import Input from '@components/Input';
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33;

type FormData = {
   name:string;
   email:string;
   password:string;
   old_password:string;
   confirm_password: string;
}

const profileSchema = yup.object({
   name: yup.string().required('Informe o nome'),
   password: yup
   .string()
   .min(6, 'A senha deve ter pelo menos 6 dígitos.')
   .nullable()
   .transform((value) => (!!value ? value : null)),
   password_confirm: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.')
    .when('password', {
       is: (Field: any) => Field,
       then: (schema) =>
          schema
         .nullable()
         .required('Informe a confirmação da senha.')
         .transform((value) => (!!value ? value : null)),
    }),
 })

export function Profile() {
   const [ isUpdating, setIsUpdating] = useState(false);
   const { user, updateUserProfile } = useAuth();

   const [ photoIsLoading , setPhotoIsLoading] = useState(false);
   const [ userPhoto, setUserPhoto] = useState<string>();

   const toast = useToast();
   
   const { control, handleSubmit, formState: {errors}} = useForm<FormData>({
      defaultValues:{
         name: user.name,
         email: user.email,
      },
      resolver: yupResolver<any>(profileSchema)
   });

   async function handleUserPhotoSelect() {

      setPhotoIsLoading(true);

      try {

         const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4, 4],
            allowsEditing: true,
         });

         if (photoSelected.canceled) {
            return
         }
      }
      catch (err){
         console.log(err)
      } finally {
         
            setPhotoIsLoading(false); 
         
      }

   }
   
   async function handleProfileUpdate( data:FormData) {
      try {
         setIsUpdating(true);

         const userUpdated = user;
         userUpdated.name = data.name;

         await api.put('/users', data);

         await updateUserProfile(userUpdated);

         toast.show({
            title:'Perfil atualizado com sucesso!',
            placement:'top',
            bgColor:'green.500'
         })

      } catch (error) {
         const isAppError = error instanceof AppError
         const title = isAppError ?  error.message : 'Erro ao atualziar perfil!'

         toast.show({
            title,
            placement:'top',
            bgColor:'red.500'
         })
      }
      finally {
         setIsUpdating(false);
      }
   }

   return (
      <VStack flex={1}>
         <ScreenHeader title='Perfil '/>
         <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
            <Center mt={6} px={10} >
               {
                  photoIsLoading ?
                  <Skeleton 
                     w={PHOTO_SIZE}
                     h={PHOTO_SIZE}
                     rounded='full'
                     startColor='gray.500'
                     endColor='gray.400'
                  /> 
                  :
                  <UserPhoto 
                     source={ user.avatar ? { uri:user.avatar } : defaultUserPhotoImg }
                     alt='Foto do usuario'
                     size={PHOTO_SIZE}

                  />
               }
               
               <TouchableOpacity onPress={handleUserPhotoSelect}>
                  <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
                     Alterar foto
                  </Text>
               </TouchableOpacity>

               <Controller 
                  control={control}
                  name='name'
                  render={({field:{ value, onChange }}) => (
                        <Input 
                           bg='gray.600'
                           placeholder='Nome'
                           onChangeText={onChange}
                           value={value}
                           errorMessage={errors.name?.message}
                        />
                     )
                  }
               />

               <Controller 
                  control={control}
                  name='email'
                  render={({field:{ value, onChange }}) => (
                        <Input 
                           bg='gray.600'
                           placeholder='E-mail'
                           onChangeText={onChange}
                           value={value}
                           isDisabled
                           isReadOnly
                        />
                     )
                  }
               />

               <Heading color='gray.200' fontSize='md' mb={2} alignSelf='flex-start' mt={12} fontFamily='heading'>
                  Alterar senha
               </Heading>

               <Controller 
                  control={control}
                  name='old_password'
                  render={({field:{ onChange }}) => (
                     <Input 
                        bg='gray.600'
                        placeholder='Senha antiga'
                        secureTextEntry
                        onChangeText={onChange}
                     />
                     )
                  }
               />

               <Controller 
                  control={control}
                  name='password'
                  render={({field:{ onChange }}) => (
                     <Input 
                        bg='gray.600'
                        placeholder='Nova senha'
                        secureTextEntry
                        onChangeText={onChange}
                        errorMessage={errors.password?.message}
                     />
                     )
                  }
               />

               <Controller 
                  control={control}
                  name='confirm_password'
                  render={({field:{ onChange }}) => (
                     <Input 
                        bg='gray.600'
                        placeholder='Confirme a nova senha'
                        secureTextEntry
                        onChangeText={onChange}
                        errorMessage={errors.confirm_password?.message}
                     />
                     )
                  }
               />

               <Button 
                  onPress={handleSubmit(handleProfileUpdate)}
                  title='Atualizar' 
                  mt={4}
                  isLoading={isUpdating}
               />

            </Center>
         </ScrollView>
      </VStack>
   )
}