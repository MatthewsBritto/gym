import { useNavigation, useFocusEffect } from '@react-navigation/native';

import ExerciseCard from '@components/ExerciseCard';
import Group from '@components/Group';
import HomeHeader from '@components/HomeHeader';

import { AppNavigationRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';

import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base';

import { useCallback, useEffect, useState } from 'react';
import { AppError } from '@utils/AppError';
import { ExercisesDto } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';



export function Home() {
   const [ isLoading, setIsLoading ] = useState(true); 
   const [ groups, setGroups] = useState<string[]>([]);
   const [ groupsSelected, setGroupsSelected] = useState('antebraço');
   const toast = useToast();

   const [ exercises, setExercises] = useState<ExercisesDto[]>([]);

   const { navigate } = useNavigation<AppNavigationRoutesProps>()

   function handleOpenExerciseDetails(exerciseId:string) {
      navigate('exercise',{ exerciseId });
   }

   async function fetchGroups() {
      try {
         
         const res = await api.get('/groups');
         setGroups(res.data);
      }
      catch(error) {
         const isAppError = error instanceof AppError;
         const title = isAppError? error.message : 'Não foi possivel carregar os grupos musculares!'
         toast.show({
            title,
            placement: 'top',
            bgColor:'red.500'
         });
      }
   }

   async function fetchExercises() {
      try {
         setIsLoading(true);
         const res = await api.get(`/exercises/bygroup/${groupsSelected}`);
         setExercises(res.data);
      }
      catch (error) {
         const isAppError = error instanceof AppError;
         const title = isAppError? error.message : 'Não foi possivel carregar os exercicios!'
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

   useEffect(() => {
      fetchGroups();
   },[]);

   useFocusEffect(useCallback(() => {
      fetchExercises();
   },[groupsSelected]));

   return (
      <VStack flex={1}>

         <HomeHeader />

         <FlatList 
            data={groups}
            keyExtractor={item => item }
            renderItem={({item}) => (
               <Group 
               name={item} 
               isActive={groupsSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
               onPress={() => setGroupsSelected(item)}
            />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{px: 8 }}
            my={10}
            maxH={10}
            minH={10}
         />       

        { isLoading ? <Loading/> :
            <VStack flex={1} px={8}>

               <HStack justifyContent='space-between' mb={5}>
                  <Heading color='gray.200' fontSize='md' fontFamily='heading'>
                     Exercícios
                  </Heading>

                  <Text color='gray.200' fontSize='sm'>
                     {exercises.length}
                  </Text>
               </HStack>

               <FlatList
                  data={exercises}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                     <ExerciseCard
                     data={item} 
                     onPress={() => handleOpenExerciseDetails(item.id.toString())}
                     />
                  )}
                  showsVerticalScrollIndicator={false}
                  _contentContainerStyle={{
                     paddingBottom: 15
                  }}
               />

            </VStack>
         }

      </VStack>
   )
}