import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigationRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg';
import Button from '@components/Button';
import { api } from '@services/api';
import { useEffect, useState } from 'react';
import { ExercisesDto } from '@dtos/ExerciseDTO';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';

type RoutesParamsProps = {
   exerciseId: string;
}

export function Exercise() {
   const [ isLoading, setIsLoading] = useState(true);
   const [ exercise, setExercise] = useState<ExercisesDto>({} as ExercisesDto)
   const { goBack } = useNavigation<AppNavigationRoutesProps>();
   const route = useRoute();

   const toast = useToast();

   const { exerciseId } = route.params as RoutesParamsProps;

   async function getExerciseInfos() {
      try {
         setIsLoading(true);
         const res = await api.get(`/exercises/${exerciseId}`);
         setExercise(res.data);
      } catch (error) {
         const isAppError = error instanceof AppError;
         const title = isAppError? error.message : 'Não foi possivel carregar os grupos musculares!'
         toast.show({
            title,
            placement: 'top',
            bgColor:'red.500'
         });
      }
      finally {
         setIsLoading(false);
      }
   }

   function handleGoBack() {
      goBack();
   }

   useEffect(() => {
      getExerciseInfos();
   },[exerciseId])

   return (
      <VStack flex={1}>

            <VStack px={8} bg='gray.600' pt={12}>
               <TouchableOpacity onPress={handleGoBack}>
                  <Icon
                     as={ Feather }
                     name='arrow-left'
                     color='green.500'
                     size={6}
                     />
               </TouchableOpacity>

               <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
                  <Heading color='gray.100' fontSize='lg' flexShrink={1}>
                     {exercise.name}
                  </Heading>

                  <HStack alignItems='center'>
                     <BodySvg/>
                     <Text color='gray.200' ml={1} textTransform='capitalize'>
                        {exercise.group}
                     </Text>
                  </HStack>
               </HStack>
            </VStack>
            
         <ScrollView>

           { isLoading ? <Loading/> :
            <VStack p={8}>
               <Image
                  w='full'
                  h={80}
                  source={{ uri:`${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                  mb={3}
                  alt='Nome do exercício'
                  resizeMode='cover'
                  rounded='lg'
               />

               <Box bg='gray.600' rounded='md' pb={4} px={4}>
                  <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
                     <HStack>
                        <SeriesSvg/>
                        <Text color='gray.200' ml='2'> 
                           { exercise.series} séries 
                        </Text>
                     </HStack>

                     
                     <HStack>
                        <RepetitionsSvg/>
                        <Text color='gray.200' ml='2'> 
                        { exercise.repetitions} Repetições 
                        </Text>
                     </HStack>

                  </HStack>

                  <Button title='Marcar como realizado'/>
                     
               </Box>
            </VStack>}
            
         </ScrollView>
      </VStack>
   )
}