import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { FlatList, HStack, Heading, Text, VStack } from 'native-base';
import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';


export function Home() {
    const [groups, setgroups] = useState(['costas', 'bíceps', 'tríceps', 'ombro']);
    const [exercises, setExercises] = useState([{exercise: 'Puxada frontal', repetition: '3 séries x 12 repetições'}, 
    {exercise: 'Remada unilateral', repetition: '3 séries x 10 repetições'}, {exercise: 'Levantamento de barra', repetition: '3 séries x 8 repetições'}])

    const [groupSelected, setGroupSelected] = useState('costas');

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetail() {
        navigation.navigate('exercise');
    }


    return(
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group 
                        name={item} 
                        isActive={ groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase() } 
                        onPress={() => setGroupSelected(item)} 
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                maxH={10}
                minH={10} 
            />

          <VStack flex={1} px={8}>
            <HStack justifyContent='space-between' mb={5}>
                    <Heading color='gray.200' fontSize='md' fontFamily='heading'>
                        Exercícios
                    </Heading>

                    <Text color='gray.200' fontSize='sm' >
                        {exercises.length}
                    </Text>
                </HStack>

                <FlatList 
                    data={exercises}
                    keyExtractor={item => item.exercise}
                    renderItem={({item}) => (
                        <ExerciseCard
                            exercise={item.exercise}
                            repetition={item.repetition}
                            onPress={handleOpenExerciseDetail}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                />
          </VStack>
        </VStack>
    )
}