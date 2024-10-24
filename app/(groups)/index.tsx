import React, { useEffect, useState } from 'react';
import styled from "styled-components/native";
import { View, FlatList, Pressable, Alert, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function Home() {
    const [redacoes, setRedacoes] = useState<Redacao[]>([]);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            loadFromCache();
        }, [])
    );

    const loadFromCache = async () => {
        try {
            const savedRedacoes = await AsyncStorage.getItem('redacoes');
            let parsedRedacoes: Redacao[] = savedRedacoes ? JSON.parse(savedRedacoes) : [];
            parsedRedacoes = parsedRedacoes.reverse();
            setRedacoes(parsedRedacoes);
        } catch (error) {
            console.error('Erro ao carregar do cache:', error);
        }
    };

    const removeRedacao = async (id: string) => {
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];

            const updatedRedacoes = parsedRedacoes.filter(redacao => redacao.id !== id);
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));

            Alert.alert('Excluído', 'Sua redação foi removida com sucesso!');
            loadFromCache(); 
        } catch (error) {
            console.error('Erro ao remover no cache:', error);
        }
    };

    const handleCardPress = (redacao: Redacao) => {
        router.push({
            pathname: '/visualizacao',
            params: {
                id: redacao.id,
                titulo: redacao.titulo,
                texto: redacao.texto
            }
        });
    };

    const downloadFile = async (titulo: string, texto: string) => {
        try {
            if (Platform.OS === 'web') {
                // Criar um blob a partir do texto
                const blob = new Blob([texto], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
    
                // Criar um elemento de link
                const a = document.createElement('a');
                a.href = url;
                a.download = `${titulo}.txt`; // Definindo o nome do arquivo
                document.body.appendChild(a); // Adiciona o link ao corpo do documento
                a.click(); // Clica no link para iniciar o download
                document.body.removeChild(a); // Remove o link do corpo
    
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            } else {
                // Para dispositivos móveis, use o Expo FileSystem
                const fileUri = FileSystem.documentDirectory + `${titulo}.txt`;
                await FileSystem.writeAsStringAsync(fileUri, texto, { encoding: FileSystem.EncodingType.UTF8 });
                await Sharing.shareAsync(fileUri);
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
            Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
        }
    };

    const renderItem = ({ item }: { item: Redacao }) => (
        <Card key={item.id}>
            <Pressable onPress={() => handleCardPress(item)} style={{ flex: 1 }}>
                <CardTitle>{item.titulo || 'Sem título'}</CardTitle>
                <CardText numberOfLines={3}>{item.texto || 'Sem conteúdo disponível.'}</CardText>
            </Pressable>

            {/* Botão para baixar a redação */}
            <DownloadButton onPress={() => downloadFile(item.titulo, item.texto)}>
                <MaterialIcons name="file-download" size={24} color="#18206f" />
            </DownloadButton>

            <RemoveButton onPress={() => removeRedacao(item.id)}>
                <MaterialIcons name="delete" size={24} color="#18206f" />
            </RemoveButton>
        </Card>
    );

    return (
        <ContainerBody>
            <Container>
                <Title>
                    <TitleTextMinhas>MINHAS</TitleTextMinhas>
                    <TitleTextRedacoes>REDAÇÕES</TitleTextRedacoes>
                </Title>

                {redacoes.length > 0 ? (
                    <FlatList
                        data={redacoes}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 50, }}
                    />
                ) : (
                    <EmptyText>Nenhuma redação salva.</EmptyText>
                )}
            </Container>

            <Footer>
                <ButtonContainer href='/newRedacao'>
                    <Icone source={require('../../assets/mais.png')} /> 
                </ButtonContainer>

                <ButtonContainer href='/sinonimos'>
                    <Icone source={require('../../assets/editor-de-texto.png')} /> 
                </ButtonContainer>
                <ButtonContainer href='/ia'>
                    <Icone source={require('../../assets/ai.png')} /> 
                </ButtonContainer>
            </Footer>
        </ContainerBody>
    );
}

const DownloadButton = styled.Pressable`
`;

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Title = styled.View`
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
`;

const TitleTextMinhas = styled(TitleText)`
    margin-bottom: 5px; 
    margin-top:-5;
`;

const TitleTextRedacoes = styled(TitleText)``;



const Card = styled.View`
    background-color: #fff;
    border-radius: 10px;
    margin-top: 2%;
    margin-bottom: 2%;
    flex: 1;  /* O card agora ocupa todo o espaço horizontal disponível */
    max-width: 45%;  /* O card terá no máximo 90% da largura da tela */
    min-height: 150px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 29%;

    @media (max-width: 768px) {
        max-width: 100%;  /* O card ocupará 100% da largura em telas menores */
    }

    @media (max-width: 480px) {
        flex-direction: column;  /* Em telas muito pequenas, alinhar o conteúdo verticalmente */
    }
`;

const CardTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #18206f;
    margin-bottom: 10px;
    min-height: 24px;
    flex-shrink: 1;  /* Permite que o título se ajuste em telas pequenas */
    padding: 10px ;

    @media (max-width: 480px) {
        font-size: 18px;  /* Diminuir o tamanho do texto em telas menores */
    }
`;

const CardText = styled.Text`
    font-size: 16px;
    color: #333;
    min-height: 48px; 
    flex-shrink: 1;  /* Faz o texto encolher em telas menores */
    padding: 5px ;
    
    @media (max-width: 480px) {
        font-size: 14px;  /* Ajustar o tamanho do texto em telas menores */
    }
`;

const EmptyText = styled.Text`
    font-size: 38px;
    color: #999;
    margin-top: 50%;
`;

const Container = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    padding: 16px;
    align-items: center;
    margin-top: 50px;
    margin-bottom:130px;
`;

const Footer = styled.View`
    width: 4vw;
    position: fixed;
    bottom: 0;
    left: 20;
    flex-direction: column;
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90vh;
    border-radius: 10px;
    padding: 10px 0;
    margin-block-end: 28px;

    @media (max-width: 768px) {
        width: 15vw;  /* Ajustar a largura para telas médias */
        height: 80vh;  /* Ajustar a altura */
    }

    @media (max-width: 480px) {
        width: 20vw;  /* Aumentar a largura em dispositivos menores */
        height: 70vh;  /* Ajustar a altura em dispositivos menores */
    }
`;

const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    margin-left: 20px;
    margin-top: 20px;
    padding: 15px;
`;

const Icone = styled.Image`
    border-radius: 10px;

    max-width: 30px;
    max-height: 30px;

    width: 100%;
    height: 100%;


`;

const RemoveButton = styled(Pressable)`
    margin-left: 10px;
`;
