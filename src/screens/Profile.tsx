import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@hooks/useAuth';

const PHOTO_SIZE = 33;

type PhotoInfo = {
    exists: boolean, 
    isDirectory: boolean, 
    modificationTime: number, 
    size: number, 
    uri: string,
}

export function Profile() {
    const [photoLoading, setPhotoLoading] = useState(false);
    const [userPhotos, setUserPhotos] = useState('https://avatars.githubusercontent.com/u/47213236?v=4');

    const { user } = useAuth();

    const toast = useToast();

    async function handleUserPhotoSelect() {
        setPhotoLoading(true);
        try{
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });
    
            if(photoSelected.canceled) {
                return;
            }

            if(photoSelected.assets[0].uri) {
                const photoInfo =  await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as PhotoInfo;

                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 2) {
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5Mb.',
                        placement: 'top',
                        bgColor: 'red.500',
                    }) 
                }

                setUserPhotos(photoSelected.assets[0].uri);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setPhotoLoading(false);
        }
    }


    return(
        <VStack flex={1}>
            <ScreenHeader
                title='Perfil' 
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                {               
                    photoLoading ?                 
                    <Skeleton 
                        w={PHOTO_SIZE} 
                        h={PHOTO_SIZE} 
                        rounded='full'
                        startColor='gray.400'
                        endColor='gray.300'
                    />
                    :
                    <UserPhoto 
                        source={{ uri: userPhotos }}
                        alt='Foto do usuário'
                        size={PHOTO_SIZE}
                    />
                }

                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
                        Alterar foto
                    </Text>
                </TouchableOpacity>

                <Input
                    placeholder='Nome'
                    bg='gray.600' 
                />

                <Input
                    placeholder='Email'
                    bg='gray.600'
                    isDisabled 
                />
                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontSize='md' mb={2} fontFamily='heading'>
                        Alterar senha
                    </Heading>

                    <Input
                        bg='gray.600'
                        placeholder='Senha Antiga'
                        secureTextEntry 
                    />

                    <Input
                        bg='gray.600'
                        placeholder='Nova Senha'
                        secureTextEntry 
                    />

                    <Input
                        bg='gray.600'
                        placeholder='Confirme a nova senha'
                        secureTextEntry 
                    />

                    <Button
                        title='Atualizar'
                        mt={4} 
                    />
                </VStack>
            </ScrollView>
        </VStack>
    )
}