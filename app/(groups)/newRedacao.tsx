import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, FlatList } from "react-native";
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import apiConfig from '../../api/axios';
import { Link as ExpoRouterLink } from 'expo-router';

export type Modelos = {
    id: number,
    titulo: string,
    imagem: string,
    corpo_redacao: string
};

export default function NewGroup() {
    const [modelos, setModelos] = useState<Modelos[]>([]);
    const router = useRouter();

    const handleModeloClick = (modelo: Modelos) => {  
        router.push({
            pathname: './editmodelo',
            params: { modeloTexto: modelo.corpo_redacao, modeloTitulo: modelo.titulo }
        });
    };

    useEffect(() => {
        async function fetchModelos() {
            try {
                const response = await apiConfig.get('/modelos');
                setModelos(response.data);
            } catch (error) {
                console.error('Erro ao buscar modelos de redação:', error);
            }
        }

        fetchModelos();
    }, []);

    return (
        <ContainerBody>
            <Container>

            </Container>

            <Div>
                <ButtonNovo href='./criarredacao'>
                    <ButtonText>Criar a Partir do Zero</ButtonText>
                </ButtonNovo>
            </Div>

            <ContentContainer>
                <FlatList
                    data={modelos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleModeloClick(item)}>
                            <Card>
                                <Imagem source={{ uri: item.imagem }} />
                                <CardTitle>{item.titulo}</CardTitle>
                            </Card>
                        </TouchableOpacity>
                    )}
                    numColumns={4}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </ContentContainer>

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
        </ContainerBody>
    );
}


const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Container = styled.View`
    padding: 10px;
    align-items: center;
    margin-top: 30px;
`;

const Div = styled.View`
    padding: 20px;
    align-items: center;
    width: 100%;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
    margin-top: -50px;
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
    height: 90vh; /* Ajusta a altura conforme o tamanho da tela */
    border-radius: 10px;
    padding: 10px 0;
    margin-block-end: 28px;
    
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

const ButtonNovo = styled(ExpoRouterLink)`
    height: 60px;
    width: 80%;
    border-radius: 8px;
    background-color: #18206f;
    padding-top: 17px;
    text-align: center;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: 700;
`;

const Card = styled.View`
    background-color: white;
    border-radius: 8px;
    margin: 10px;
    padding: 30px;
    width: 90% ;

    min-width: 70%;
    max-width: 135%; 
    min-height: 150px;
    
`;

const Imagem = styled.Image`
    width: 100px;
    height: 120px;
    border-radius: 8px;
`;

const CardTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
    color:#18206f;
    width:  100%;
`;

const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom:100px;
`;