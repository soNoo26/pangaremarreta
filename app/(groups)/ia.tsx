import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';

const ArgumentScreen = () => {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendTopic = async () => {
    if (!topic) {
      alert('Por favor, insira um tema.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.56:3000/argumento', { tema: topic });
      setResponse(res.data);
    } catch (error) {
      setResponse('Erro ao gerar redação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  return (
    <ContainerBody>
      <View style={styles.container}>
        <Text style={styles.label}>Insira o tema da redação:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o tema aqui..."
          value={topic}
          onChangeText={setTopic}
        />
        <TouchableOpacity 
          style={[styles.customButton, loading && styles.buttonDisabled]} 
          onPress={handleSendTopic} 
          disabled={loading}
        >
        
        <Text style={styles.buttonText}>
            {loading ? 'Gerando...' : 'Gerar Redação'}
          </Text>
        </TouchableOpacity>

        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseText}>{response}</Text>
        </ScrollView>
      </View>

      <Footer>
        <ButtonContainer href='/(groups)'>
            <Icone source={require('../../assets/botao-de-inicio.png')} />
        </ButtonContainer>

        <ButtonContainer1 onPress={() => navigation.goBack()}>
           <Icone source={require('../../assets/back-button.png')} />
       </ButtonContainer1>

        <ButtonContainer href='/sinonimos'>
          <Icone source={require('../../assets/editor-de-texto.png')} /> 
        </ButtonContainer>


      </Footer>
    </ContainerBody>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: 850,
    marginLeft: 625,
    backgroundColor: '#f2f2f2',
  },
  label: {
    marginLeft: 250,
    fontSize: 30,
    marginBottom: 10,
    width: 600,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: 830,
    marginLeft: 0,
    fontSize: 18,
  },
  customButton: {
    backgroundColor: '#18206f',  // Cor do botão
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: 200,
    marginLeft: 300,
  },
  buttonText: {
    color: '#fff',  // Cor do texto do botão
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',  // Cor do botão quando desabilitado
  },
  loading: {
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: '#18206f',
  },
  responseContainer: {
    marginTop: 20,
    maxHeight: 450,
    height: 400,
  },
  responseText: {
    fontSize: 16,
    color: '#000',
    height: 400 ,
  },
});

const ContainerBody = styled.View`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
  margin-top: 2%;
  margin-left: 17%;
  width: 400px;
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

const ButtonContainer1 = styled.TouchableOpacity`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    margin-left: 1px;
    margin-top: 20px;
    padding: 15px;
`;

export default ArgumentScreen;