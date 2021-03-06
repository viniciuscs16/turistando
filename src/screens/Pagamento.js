import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Picker,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-elements';
import api from '../../api';
import apipagamento from '../../apipagamento';

import {TextInputMask} from 'react-native-masked-text';
export default class Pagamento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: [],
      error: null,
      dialogVisible: false,
      name: '',
      lastName: '',
      email: '',
      telefone: '',
      bairro: '',
      cidade: '',
      bio: '',
      personalidade: 'aventureiro',
      tipo: 'turista',
      hotel: '',
      disp: '',
      avaliacao: '',
      idade: '',
      item: [],
      account_id: 'D1B7E5A209C34348BC26F22BA8653A96',
      method: 'credit_card',
      test: 'false',
      number: '',
      verification_value: '',
      first_name: '',
      last_name: '',
      month: '',
      year: '',
      token: '',
      valorAux:'',
      data:'',
      idUser:''
    };
  }

  componentDidMount = async () => {
    const email = await AsyncStorage.getItem('@turistando2:userEmail');
    const token = await AsyncStorage.getItem('@turistando2:token');
    const {navigation} = this.props;
    const aux = navigation.getParam('dados');
    const aux2 = navigation.getParam('nome');
    console.log('dado da outra pagina:' + aux2);
    let link = '/showUserByEmail/' + email;
    const usuario = await api.get(link, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.setState({
      user: usuario.data,
      name: usuario.data.name,
      lastName: usuario.data.lastName,
      email: usuario.data.email,
      telefone: usuario.data.telefone,
      bairro: usuario.data.bairro,
      cidade: usuario.data.cidade,
      personalidade: usuario.data.personalidade,
      tipo: usuario.data.tipo,
      hotel: usuario.data.hotel,
      disp: usuario.data.disp,
      avaliacao: usuario.data.avaliacao,
      idade: usuario.data.idade,
      bio: usuario.data.bio,
      idUser:usuario.data.id,
      loading: false,
      item: aux,
      nomeLider: aux2,valorAux:aux.valor+'00'
    });
   
  };

  onChangeText = (key, val) => {
    let s = val.replace(/[/]+/g, '');
 s = s.replace(/[,]+/g, '');
 s = s.replace(/[.]+/g, '');
 s = s.replace(/[R]+/g, '');
 s = s.replace(/[$]+/g, '');
    this.setState({[key]: val});
  };

  

  saveChanges = async () => {
    // if (this.state.first_name.length === 0
    //     || this.state.last_name.length === 0 || this.state.month.length === 0
    //     || this.state.number.length === 0 || this.state.verification_valuelength === 0
    //     || this.state.year.length === 0 ) {
    //     this.setState({ error: 'Preencha todos os dados de usuário!' }, () => false);
    //     Alert.alert('Erro', 'Preencha todos os dados de usuário!');
    // } else {
    try {
      // console.log(this.state);
      // console.log(this.state.account_id);
      //     console.log(this.state.method);
      //         console.log(this.state.number);

      //         console.log(this.state.verification_value);
      //         console.log(this.state.first_name);
      //         console.log(this.state.last_name);
      //         console.log(this.state.month);
      //         console.log(this.state.year);
      //console.log(this.state.test);

      const aux= `${this.state.data}`
      console.log( aux.slice(-4))
      let auxyear=aux.slice(-4)
     // this.setState({year:  aux2});
      //const valototal=preco.slice(0,2)+','+novo//Arrumar isso aqui
      this.setState({month:aux.slice(0,2)});
      let auxmonth= aux.slice(0,2)
      console.log( aux.slice(0,2))

      console.log(this.state)
      const response = await apipagamento.post('/payment_token', {
        // account_id: "D1B7E5A209C34348BC26F22BA8653A96",
        // method: "credit_card",
        // test: "false",
        // data: {
        //   number: "asdf",
        //   verification_value: "asdf",
        //   first_name: "asdf",
        //   last_name: "asdfC asdf",
        //   month: "asdf",
        //   year: "20asdf21",
        // },

        account_id: this.state.account_id,
        method: this.state.method,
        test: this.state.test,
        data: {
          number: this.state.number,
          verification_value: this.state.verification_value,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          month:auxmonth,
          year: auxyear,
        },
       });
      console.log("token:"+response.data.id);
      this.state.token = response.data.id;
      try {
        // {
        //     "token": "4050357DFAD840DD9D0A612781AF7017",
        //   "items":
        //       [
        //                 { "description": "asdads",
        //                  "quantity": "1",
        //                  "price_cents": "9999"
        //                 }
        //             ],
        //      "payer": {
        //              "email": "renatosilveira90@gmail.com"
        //                         }
        // }
        // console.log( "token "+this.state.token)
        // console.log(this.state.item.descricao)
        // console.log(this.state.email)
        // console.log(this.state.name)
       
        // console.log("v:"+valor+"e")
        // if( valor.length<2){
        //      valor=valor+"00"
        //      console.log("corrigindo"+valor)
        // } parseInt(this.state.item.valor + "00");

        // let valor =parseInt(this.state.valorAux) 
        // console.log("valor:"+this.state.valorAux)
       
        // console.log("valormul:"+valor)
        
      //  let valor2 =valor

        pagamento = await apipagamento.post(
          '/charge?api_token=066de07419c9c0e9bb48e18ff31674d1',
          {
            token: this.state.token,
            items: [
              {
                description:
                  this.state.item.descricao + '-' + this.state.nomeLider,
                quantity: 1,
                price_cents:  this.state.item.valor,
              },
            ],
            payer: {
              email: this.state.email,
              name: this.state.name,
            },
            json: true,
          },
        );
        
       
         
          if(pagamento.data.success){
            Alert.alert(
              'Transação Aprovada!'
            );
            const link='/cadastraTurista/'+this.state.item.id
            const token2 = await AsyncStorage.getItem('@turistando2:token')
               const chamada= await api.post(link, {
                  headers: {
                    Authorization: `Bearer ${token2}`,
                  },
                  user_id:this.state.idUser,
                  rota_id:this.state.item.id,
    
                });
                console.log(chamada)
                const teste = await api.get('/listaUsuario', {
                  headers: {
                    Authorization: `Bearer ${token2}`,
                  },
                });
              console.log(teste)
    
          }else{            
            Alert.alert(
              'Transação negada!','Tente novamente'
            );
          }

      } catch (error) {
        this.setState({
          error: '2Houve um problema com o pagamento, verifique os dados!',
        });
        Alert.alert(
          'Verifique seu email!',
          'Caso a confirmação de pagamento não chegar em 24 horas entre em contato!',
        );
        //console.log(_err);
      }
      this.props.navigation.goBack();
    } catch (_err) {
      this.setState({
        error: 'Houve um problema com o pagamento, verifique os dados!',
      });
      Alert.alert(
        'Erro',
        'Houve um problema com o pagamento, verifique os dados!',
      );
      console.log(_err);
    }
    // }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2E3BC',
          }}>
          <Text style={styles.textoTitulo}>Pagamento</Text>
        </View>
        <View
          style={{
            flex: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScrollView>
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="Nome do Titular do cartão"
                autoCapitalize="none"
                placeholderTextColor="rgb(87, 128, 178)"
                value={this.state.first_name}
                textContentType={'name'}
                onChangeText={val => this.onChangeText('first_name', val)}
              />
              <TextInput
                style={styles.input}
                placeholder="Sobrenome do Titular do cartão"
                autoCapitalize="none"
                placeholderTextColor="rgb(87, 128, 178)"
                value={this.state.last_name}
                textContentType={'name'}
                onChangeText={val => this.onChangeText('last_name', val)}
              />
              <TextInput
                style={styles.input}
                placeholder="Número do cartão"
                autoCapitalize="none"
                placeholderTextColor="rgb(87, 128, 178)"
                value={this.state.number}
                keyboardType={'cc-number'}
                maxLength={16}
                onChangeText={val => this.onChangeText('number', val)}
              />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                autoCapitalize="none"
                placeholderTextColor="rgb(87, 128, 178)"
                keyboardType={'number-pad'}
                value={this.state.verification_value}
                maxLength={3}
                onChangeText={val => this.onChangeText('verification_value', val)}

              />
              <TextInputMask
              style={styles.input}
              placeholder="Data do vencimento do cartão de crédito"
              placeholderTextColor="rgb(87, 128, 178)"
                type={'datetime'}
                options={{
                  format: 'MM/YYYY',
                }}
                value={this.state.data}
                onBlur={Keyboard.dismiss}
                onChangeText={val => this.onChangeText('data', val)}
              />
              <Button
                title="Pagar"
                onPress={this.saveChanges}
                buttonStyle={styles.botao}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'rgb(87, 128, 178)',
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    width: (Dimensions.get('window').width * 8) / 10,
    margin: 10,
  },
  inputMenor: {
    borderColor: 'rgb(87, 128, 178)',
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    width: (Dimensions.get('window').width * 6) / 10,
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPicker: {
    marginVertical: 15,
    width: (Dimensions.get('window').width * 8) / 10,
    padding: 10,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'rgb(87, 128, 178)',
    borderWidth: 2,
  },
  pickerEstilo: {
    color: 'rgb(87, 128, 178)',
    width: (Dimensions.get('window').width * 7) / 10,
  },
  texto: {
    color: 'rgb(87, 128, 178)',
  },
  botao: {
    alignItems: 'center',
    backgroundColor: 'rgb(87, 128, 178)',
    borderRadius: 20,
    width: (Dimensions.get('window').width * 8) / 10,
    margin: 15,
  },
  textoTitulo: {
    fontFamily: 'arial',
    fontSize: 30,
    color: '#75b8c8',
  },
});
