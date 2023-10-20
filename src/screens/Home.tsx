import ExerciseCard from '@components/ExerciseCard';
import Group from '@components/Group';
import HomeHeader from '@components/HomeHeader';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationRoutesProps } from '@routes/app.routes';

import { VStack, FlatList, HStack, Heading, Text } from 'native-base';

import { useState } from 'react';

export function Home() {
   const [ groups, setGroups] = useState(['costa', 'biceps', 'triceps','ombro' ]);
   const [ groupsSelected, setGroupsSelected] = useState('costa');

   const [ exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra']);

   const { navigate } = useNavigation<AppNavigationRoutesProps>()

   function handleOpenExerciseDetails() {
      navigate('exercise');
   }


   return (
      <VStack flex={1}>

         <HomeHeader />

         <FlatList 
            data={groups}
            keyExtractor={item => item}
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
               keyExtractor={item => item}
               renderItem={({item}) => (
                  <ExerciseCard
                   name={item} 
                   onPress={handleOpenExerciseDetails}
                  />
               )}
               showsVerticalScrollIndicator={false}
               _contentContainerStyle={{
                  paddingBottom: 15
               }}
            />

         </VStack>

      </VStack>
   )
}