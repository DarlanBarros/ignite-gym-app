import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
    exercise: string;
    repetition: string;
}

export function ExerciseCard({exercise, repetition, ...rest}: Props) {
    return(
        <TouchableOpacity {...rest}>
            <HStack bg='gray.500' alignItems='center' p={2} pr={4} rounded='md' mb={3}>
                <Image
                    source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRasY5nxwccsu2oFiuYkPUYTS2NAKaY-d1QaA&usqp=CAU'}} 
                    alt="Imagem exemplificando o exercicio remada unilateral"
                    w={16}
                    h={16}
                    rounded='md'
                    mr={4}
                    resizeMode="cover"
                />
                <VStack flex={1}>
                    <Heading fontSize='lg' color='gray.200' mt={1} fontFamily='heading'>{exercise}</Heading>

                    <Text fontSize='sm' color='gray.200' mt={1} numberOfLines={2}>{repetition}</Text>
                </VStack>

                <Icon as={Entypo} name="chevron-thin-right" color='gray.300' />
            </HStack>
        </TouchableOpacity>
    )
}