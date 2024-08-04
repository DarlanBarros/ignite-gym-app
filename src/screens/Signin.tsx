import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import BackgroundImg from '../assets/background.png';
import LogoSvg from '../assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useForm, Controller } from 'react-hook-form';

import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormDataProps = {
    email: string;
    password: string;
}

export function Signin() {
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();

    function handdleNewAccount() {
        navigation.navigate('signUp');
    }

    async function handdleSignIn({email, password}: FormDataProps) {
        try {
            setIsLoading(true);
            await signIn(email, password);
        } catch(error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

            setIsLoading(false);

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt='Imagem de fundo'
                    position='absolute'
                    resizeMode='contain'
                />

                <Center my={24}>
                    <LogoSvg />
                    <Text color='gray.100' fontSize='sm'>
                        Treine sua mente e seu corpo
                    </Text>
                </Center>


                <Center>
                    <Heading color='gray.100' fontSize={'xl'} mb={6} fontFamily='heading'>
                        Acesse sua conta
                    </Heading>

                    <Controller 
                        control={control}
                        name='email'
                        rules={{ required: 'Informe o email' }}
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder='Email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message} 
                            />
                        )}
                    />


                    <Controller 
                        control={control}
                        name='password'
                        rules={{ required: 'Informe a senha'}}
                        render={({ field: { onChange, value }}) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry 
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title='Acessar'
                        onPress={handleSubmit(handdleSignIn)}
                        isLoading={isLoading}
                    />
                </Center>

                <Center mt={24}>
                    <Text color='gray.100' fontSize='sm' mb={3} fontFamily='body'>
                        Ainda não tem acesso?
                    </Text>

                    <Button
                        title='Crie sua conta'
                        variant='outline'
                        onPress={handdleNewAccount}
                    />
                </Center>

            </VStack>
        </ScrollView>
    );
}