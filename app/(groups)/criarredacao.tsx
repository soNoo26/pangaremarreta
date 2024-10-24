import React, { useState, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '@/components/Input';
import InputRedacao from '@/components/InputRedacao';
import { useRouter, useLocalSearchParams, Link as ExpoRouterLink } from 'expo-router';

export default function NovoModelo() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [titulo, setTitulo] = useState<string>('');
    const [texto, setTexto] = useState<string>('');
    const router = useRouter();
    const { modeloTexto, modeloTitulo } = useLocalSearchParams();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        if (modeloTitulo && modeloTexto) {
            setTitulo(Array.isArray(modeloTitulo) ? modeloTitulo[0] : modeloTitulo);
            setTexto(Array.isArray(modeloTexto) ? modeloTexto[0] : modeloTexto);
        }
    }, [modeloTitulo, modeloTexto]);

    const handleTextChange = (text: string) => {
        setTexto(text);
        if (text.length === 2000) {
            Alert.alert('Atenção', 'Você atingiu 2000 caracteres! Aproximadamente 30 linhas');
        }
    };

    const handleEditClick = async () => {
        try {
            const existingData = await AsyncStorage.getItem('redacoes');
            const redacoes = existingData ? JSON.parse(existingData) : [];
            redacoes.push({ id: Math.random().toString(36).substr(2, 9), titulo, texto });

            await AsyncStorage.setItem('redacoes', JSON.stringify(redacoes));
            Alert.alert('Salvo', 'Sua redação foi salva com sucesso!');
            router.push('/(groups)');
        } catch (error) {
            Alert.alert('Erro', 'Houve um erro ao salvar sua redação.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ContainerBody>
                <Header>

                <TituloTextoContainers>
                    <Input
                        style={{ flex: 1 }}
                        placeholder="Título"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                    </TituloTextoContainers>

                    <Pressable style={estilo.botaosalvar} onPress={handleEditClick}>
                        <Text style={{ color: '#fff' }}>Salvar</Text>
                    </Pressable>
                </Header>


                <ScrollContainer>
                    <ScrollView contentContainerStyle={{ paddingBottom: 1 }}>
                        <InputRedacao
                            placeholder="Escreva sua redação..."
                            multiline={true}
                            style={{ height: 50, borderWidth: 1, padding: 13, maxHeight: 900 }}
                            onChangeText={handleTextChange}
                            value={texto}
                        />
                    </ScrollView>
                </ScrollContainer>

               
                {!keyboardVisible && (
                    <Footer>
                        <ButtonContainer href='/(groups)'>
                            <Icone source={require('../../assets/botao-de-inicio.png')} /> 
                        </ButtonContainer>
                        <ButtonContainer href='/sinonimos'>
          <Icone source={require('../../assets/editor-de-texto.png')} /> 
        </ButtonContainer>
                        <ButtonContainer href='/ia'>
                            <Icone source={require('../../assets/ai.png')} /> 
                        </ButtonContainer>
                    </Footer>
                )}
            </ContainerBody>
        </KeyboardAvoidingView>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;

`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #F5F5F5;
    padding: 16px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding-top: 20px; 
    margin-bottom:-57px;
`;

const ScrollContainer = styled.View`
    flex: 1;
    padding-top: 120px; 
    padding-bottom: 90px;
    margin-left: 8rem;
    margin-right: 50px;


`;

const TituloTextoContainers = styled.View`
    flex: 1; 
    margin-right: 50px;
    margin-left: 8rem;
`;

const Footer = styled.View`
    width: 4vw; /* Define a largura relativa à viewport */
    position: absolute;
    bottom: 0;
    left: 20;
    flex-direction: column; /* Mantém a direção em coluna */
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 74vh; /* Ajusta a altura conforme o tamanho da tela */
    border-radius: 10px;
    padding: 10px 0;
    margin-block-end: 70px;
;
    
    @media (max-width: 768px) { /* Para telas menores */
        width: 20vw; /* Ajuste para telas menores */
        height: 80vh; /* Ajusta a altura */
    }

    @media (max-width: 480px) { /* Para dispositivos móveis */
        width: 25vw; /* Aumenta um pouco a largura em dispositivos menores */
        height: 70vh; /* Ajusta altura para caber na tela */
    }
`;


const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    margin-left: 20px;
    margin-top: 15px;
    padding: 15px;
    
`;

const Icone = styled.Image`
    border-radius: 10px;

    max-width: 30px;
    max-height: 30px;

    width: 100%;
    height: 100%;


`;


const estilo = StyleSheet.create({
    botaosalvar: {
        backgroundColor: '#18206f', 
        paddingBottom: 14,
        paddingTop: 14,
        width: 80,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: -33,
    },
});