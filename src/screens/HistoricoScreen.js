import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Keyboard, ImageBackground,
} from 'react-native';
import {
  Image,
  Button,
  ListItem,
  SearchBar,
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

import IOSIcon from 'react-native-vector-icons/Ionicons';

export default class HistoricoScreen extends Component {
    //Tela inicial, nesta tela esta a pesquisa
    constructor(props) {
      super(props);
      global.cont = 0;
      global.aux = [];
  
      this.state = {
        loading: false,
        data: [],
        error: null,
        selecionado: [],
        dialogVisible: false,
        quantidadeItem: 0,
      };
      this.submit = this.submit.bind(this);
      this.arrayholder = [];
    }
    //Comentado até o backend estar pronto
    componentDidMount() {
      this.makeRemoteRequest();
    }
  
    makeRemoteRequest = () => {
      const url = [
        {
          Id: 1,
          valor: '55,00',
          localDeSaida: 'Avenida 3, 350 - Centro',
          cidade: 'Poços de caldas',
          titulo: 'Igrejas Históricas',
          Saída: '11/11 - 14:00',
          Duração: '3 Horas',
          Vaga: '2 Vagas',
          description:
            'Serão visitadas suas cachoeiras da região em um passeio imersivo que tem como objetivo conectar o turista à natureza em uma trilha calma e bela.',
          foto:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8KCTe4B1W_XnGo0x_9bnWUXAaWGaX58cnI_iNkbZu-64u4MKinA&s.jpg',
        },
        {
          Id: 2,
          valor: '80,00',
          localDeSaida: 'Avenida Joao Pinheiro, 340 - Centro',
          cidade: 'Poços de caldas',
          titulo: '#Partiu Praias',
          Saída: '11/11 - 10:00',
          Duração: '5 Horas',
          Vaga: '2 Vagas',
          description:
            'Serão visitadas suas cachoeiras da região em um passeio imersivo que tem como objetivo conectar o turista à natureza em uma trilha calma e bela pela praia.',
          foto:
            'https://www.viajali.com.br/wp-content/uploads/2018/01/praia-do-gunga-1-730x730.jpg',
        },
        {
          Id: 4,
          valor: '50,00',
          localDeSaida: 'Avenida 1, 310 - Centro',
          cidade: 'São Paulo',
          titulo: 'Passeio Turistico',
          Saída: '12/11 - 16:00',
          Duração: '3 Horas',
          Vaga: '5 Vagas',
          description:
            'Serão visitadas monumentos da região em um passeio imersivo para o turista conhecer a história da maior cidade do Brasil .',
          foto:
            'https://media-cdn.tripadvisor.com/media/photo-s/18/99/d8/ed/paulista.jpg',
        },
      ]; //URL da API  do JSON com as informações
      this.setState({ loading: true });
  
      this.setState({
        data: url,
        loading: false,
      });
      this.arrayholder = url;
    };
  
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 20,
            width: '100%',
           
          }}
        />
      );
    };
  
  
  
    submit(item) {
      //console.log(global.cont)
      //const { navigation } = this.props;
      //const itemId = navigation.getParam('dados');
      this.props.navigation.navigate('Modal', { dados: item }); //Próxima rota
    }
  
    render() {
      if (this.state.loading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        );
      }
      //console.log(global.aux)
      return (<ImageBackground source={{ uri: 'https://static3.tcdn.com.br/img/img_prod/580806/papel_de_parede_calcadao_de_copacabana_2067_2_20190521103442.jpg' }} style={{ width: '100%', height: '100%' }}>
      <View style={{ flex: 1, backgroundColor: '#e6e6e699' }}>
      <View
                    style={{
                        flex: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F2E3BC',marginBottom:10
                    }}>
                    <Text style={styles.textoTitulo}>Histórico</Text>
                </View>
        <View style={{ flex: 10, justifyContent: "center", alignItems: "center" }} >
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableHighlight style={{
                paddingTop: 5, borderRadius: 30, justifyContent: "center", alignItems: "center", width: (Dimensions.get('window').width * 9) / 10,
                height: (Dimensions.get('window').height * 2) / 10, backgroundColor: "white"
              }} onPress={() => this.submit(item)}>
                <View style={styles.containerLateral}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{ uri: item.foto }}
                      style={{
                        width: (Dimensions.get('window').width * 2.5) / 10,
                        height: (Dimensions.get('window').height * 1.5) / 10,
                      }}
                    />
                  </View>

                  <View style={{ flex: 3, marginRight: 10, paddingTop: 24 }}>
                    <View style={styles.containerTextoTitulo}>
                      <Text style={styles.titulo}>{item.titulo}</Text>
                    </View>
                    <View style={styles.containerTexto}>
                      <Text style={styles.texto}>
                        {item.Vaga} - {item.cidade}
                      </Text>
                    </View>
                    <View style={styles.containerTexto}>
                      <Text style={styles.texto}>Saida: {item.Saída}</Text>
                    </View>

                    <View style={styles.containerTexto}>
                      <Text style={styles.texto}>Duração: {item.Duração}</Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            )}
            ItemSeparatorComponent={this.renderSeparator}

          />
        </View>

      </View>
    </ImageBackground>
      );
    }
  }
  


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }, searchSection: {
      flex: 1.3, margin: 20,
      flexDirection: 'row',
      justifyContent: 'flex-start', backgroundColor: "white",
      alignItems: 'center', borderRadius: 40, paddingLeft: 10
    },
    containerLateral: {
      flex: 1,
      flexDirection: 'row', paddingLeft: 20
    },
    titulo: {
      fontWeight: 'bold',
      fontSize: 25,
      color: '#75b8c8',
    },
    titulo2: {
      fontWeight: 'bold',
      fontSize: 30,
      color: '#75b8c8',
    },
    texto: {
      fontSize: 16,
    },
    containerLista: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerTexto: {
      flex: 0.2,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    }, containerTextoTitulo: {
      flex: 0.15,
      justifyContent: 'flex-end',
      alignItems: 'flex-end', paddingBottom: 15
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "rgb(87, 128, 178)",
      borderRadius: 20,
      width: (Dimensions.get('window').width) * 6 / 10,
      height: (Dimensions.get('window').height) * 0.6 / 10,
      margin: 15
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
    },
    inputContainer: {
      paddingTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      borderColor: '#CCCCCC',
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderLeftWidth: 2,
      borderTopWidth: 2,
      width: 300,
      height: 50,
      fontSize: 25,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 10,
    },
    botaoLogin:{
      alignItems: 'center',
      backgroundColor: "rgb(87, 128, 178)",
      borderRadius: 20,
      width: (Dimensions.get('window').width) * 8 / 10,
      margin: 15
    },textoTitulo: {
        fontFamily: 'arial',
        fontSize: 30,
        color: '#75b8c8',
    }
  });