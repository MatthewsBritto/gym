import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup';

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png' 
import Input from '@components/Input';
import Button from '@components/Button';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
   name: string;
   email: string;
   password: string;
   password_confirm: string
}

const signUpSchema = yup.object({
   name: yup.string().required('Informa o nome.'),
   email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
   password: yup.string().required('Digite uma senha.'),
   password_confirm: yup.string().required('Confirme sua senha.').oneOf([yup.ref('password')], 'As senhas são diferentes.')
});

export function SignUp() {
   const [ isLoanding, setIsLoading ] = useState(false);
   const { signIn } = useAuth();

   const { control, handleSubmit, formState : { errors } } = useForm<FormDataProps>({
      resolver: yupResolver(signUpSchema)
   });

   const toast = useToast();

   const navigation = useNavigation();

   function handleGoBack(){
      navigation.goBack();
   }

   async function handleSignUp({ name, email, password }: FormDataProps) {
      try {
         setIsLoading(true);
         await api.post('/users', { name, email, password});
         await signIn(email, password);

         
      } catch( err ) {
         setIsLoading(false)
         const isAppError = err instanceof AppError;
         const title = isAppError ? err.message : 'Não foi possivel criar a conta.'

         toast.show({
            title,
            placement:'top',
            bgColor:'red.500'
         });
      }

   }

   return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
         <VStack flex={1} px={10} pb={16}>
            <Image
               source={BackgroundImg}
               defaultSource={BackgroundImg}
               alt='Pessoas Treinando'
               resizeMode='contain'
               position="absolute"
            />

            <Center my={24}>
               <LogoSvg/>

               <Text color="gray.100" fontSize="sm">
                  Treine sua mente e o seu corpo
               </Text>
            </Center>

            <Center>               
               <Heading color='gray.100' fontSize="xl" mb={6} fontFamily='heading'>
                  Cria a sua conta
               </Heading>

               <Controller
                  control={control}
                  name='name'
                  render={({ field: { onChange, value } }) => (
                     <Input 
                       placeholder='Nome'
                       onChangeText={ onChange } 
                       value={value}
                       errorMessage={errors.name?.message}                 
                     /> 

                  )}
               />

               <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, value } }) => (
                     <Input 
                     placeholder='E-mail' 
                     keyboardType='email-address'
                     autoCapitalize='none'
                     onChangeText={ onChange }
                     value={ value }
                     errorMessage={errors.email?.message}
                     /> 

                  )}
               />

               <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, value } }) => (
                     <Input 
                        placeholder='Senha' 
                        secureTextEntry
                        onChangeText={ onChange }
                        value={ value }
                        errorMessage={errors.password?.message}
                     /> 

                  )}
               />

               <Controller
                  control={ control }
                  name='password_confirm'
                  render={({ field: { onChange, value } }) => (
                     <Input 
                        placeholder='Confirma a Senha' 
                        secureTextEntry
                        onChangeText={ onChange }
                        value={ value }
                        onSubmitEditing={handleSubmit(handleSignUp)}
                        returnKeyType='send'
                        errorMessage={errors.password_confirm?.message}
                     /> 

                  )}
               />

               <Button
                  title='Criar e acessar'
                  onPress={handleSubmit(handleSignUp)}
                  isLoading={isLoanding}
               />

            </Center>
           

            <Button
                  title='Voltar para login'
                  variant='outline'
                  mt={24}
                  onPress={handleGoBack}
            />
           
         </VStack>
      </ScrollView>
   );
}