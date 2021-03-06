import React from 'react'
import {
    AsyncStorage,
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    Picker,
    Text,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import { Button, Icon } from "react-native-elements"
import { ScrollView } from 'react-native-gesture-handler';
import api from '../../api';

let textInputCadastur = <View></View>

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Selecione foto de perfil',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


export default class SignUp extends React.Component {
    static navigationOptions = {
        title: 'Cadastre-se'
    };

    state = {
        loading: false,
        name: '', lastName: '', email: '', password: '', telefone: '', bairro: '', cidade: '',
        personalidade: 'aventureiro', tipo: 'turista', hotel: '', disp: '', avaliacao: '', idade: '',
        bio: 'Adicione uma bio para que possam te conhecer melhor! Basta clicar em Editar Perfil!',
        avatarSource: null
    }

    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }

    signUp = async () => {
        this.setState({ loading: true });
        if (this.state.email.length === 0 || this.state.password.length === 0
            || this.state.name.length === 0 || this.state.lastName.length === 0
            || this.state.telefone.length === 0 || this.state.bairro.length === 0
            || this.state.cidade.length === 0 || this.state.idade.length === 0) {
            this.setState({ loading: false });
            this.setState({ error: 'Preencha todos os dados de cadastro para continuar!' }, () => false);
            Alert.alert('Erro', 'Preencha todos os dados de cadastro para continuar!');
        } else {
            try {
                const resposta = await api.post('/register', {
                    name: this.state.name,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                    telefone: this.state.telefone,
                    bairro: this.state.bairro,
                    cidade: this.state.cidade,
                    personalidade: this.state.personalidade,
                    tipo: this.state.tipo,
                    hotel: this.state.hotel,
                    disp: this.state.avaliacao,
                    avaliacao: this.state.avaliacao,
                    idade: this.state.idade,
                    bio: this.state.bio
                });

                const response = await api.post('/authenticate', {
                    email: this.state.email,
                    password: this.state.password,
                });


                let link = '/showUserByEmail/' + this.state.email
                const response2 = await api.get(link, {
                    headers: {
                        'Authorization': `Bearer ${response.data.token}`
                    }
                });
                const tipo = response2.data.tipo

                await AsyncStorage.multiSet([['@turistando2:token', response.data.token],
                ['@turistando2:userEmail', this.state.email],
                ['@turistando2:userTipo', tipo]])

                this.setState({ loading: false });
                this.props.navigation.navigate('App');
            } catch (_err) {
                this.setState({ loading: false });
                this.setState({ error: 'Houve um problema ao cadastrar, verifique suas credenciais!' });
                Alert.alert('Erro', 'Houve um problema ao cadastrar, verifique suas credenciais!(Seu email pode ja ter sido cadastrado)');
                console.log(_err);
            }
        }
    }

    campoGuia(tipo) {
        if (tipo == "guia") {
            textInputCadastur =
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder='CADASTUR'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.name}
                        onChangeText={val => this.onChangeText('cadastur', val)}
                    />
                </View>
        } else {
            textInputCadastur = <View></View>
        }
    }

    carregarImagem = () => {

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                Alert.alert('Erro', 'Erro ao abrir galeria!');
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({ avatarSource: source });
            }
        });

    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Cadastrando</Text>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder='Nome'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.name}
                        textContentType={"name"}
                        onChangeText={val => this.onChangeText('name', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Sobrenome'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.lastName}
                        textContentType={"familyName"}
                        onChangeText={val => this.onChangeText('lastName', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.email}
                        keyboardType={"email-address"}
                        onChangeText={val => this.onChangeText('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Senha'
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.password}
                        onChangeText={val => this.onChangeText('password', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Telefone(Formato: 021-999999999)'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.telefone}
                        keyboardType={"phone-pad"}
                        maxLength={15}
                        onChangeText={val => this.onChangeText('telefone', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Idade'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.idade}
                        onChangeText={val => this.onChangeText('idade', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Bairro'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.bairro}
                        onChangeText={val => this.onChangeText('bairro', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Cidade'
                        autoCapitalize="none"
                        placeholderTextColor="rgb(87, 128, 178)"
                        value={this.state.cidade}
                        onChangeText={val => this.onChangeText('cidade', val)}
                    />
                    <View style={styles.containerPicker}>
                        <Text style={styles.texto}>Qual seu jeito?</Text>
                        <Picker
                            selectedValue={this.state.personalidade}
                            style={styles.pickerEstilo}
                            pickerStyleType={styles.input}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ personalidade: itemValue })
                            }>
                            <Picker.Item label="Aventureiro!" value="aventureiro" />
                            <Picker.Item label="Cultural!" value="cultural" />
                            <Picker.Item label="Baladeiro!" value="baladeiro" />
                            <Picker.Item label="Tradicional!" value="tradicional" />
                        </Picker>
                    </View>
                    <View style={styles.containerPicker}>
                        <Text style={styles.texto}>QUEM VOCÊ QUER SER?</Text>
                        <Picker
                            selectedValue={this.state.tipo}
                            style={styles.pickerEstilo}
                            pickerStyleType={styles.input}
                            onValueChange={async (itemValue, itemIndex) =>
                                this.setState({ tipo: itemValue }, this.campoGuia(itemValue))
                            }>
                            <Picker.Item label="Quero ser turista!" value="turista" />
                            <Picker.Item label="Quero ser líder de Rota!" value="lider" />
                            <Picker.Item label="Quero ser guia de turismo!" value="guia" />
                        </Picker>
                    </View>

                    {textInputCadastur}

                    <View style={styles.containerPicker}>
                        <Text style={styles.texto}>VOCÊ VEIO POR ALGUMA POUSADA/HOSTEL PARCEIRO?
                        SE SIM, DIGITA O NOME DELA AQUI</Text>
                        <TextInput
                            style={styles.inputMenor}
                            placeholder='POUSADA/HOSTEL'
                            autoCapitalize="none"
                            placeholderTextColor="rgb(87, 128, 178)"
                            value={this.state.hotel}
                            onChangeText={val => this.onChangeText('hotel', val)}
                        />
                    </View>
                    <View style={styles.containerPicker}>
                        <Text style={styles.texto}>CASO TENHA ESCOLHIDO LÍDER DE ROTA, QUAIS DIAS (E HORA)
                        NA SEMANA VOCÊ TEM PARA APRESENTAR SUA CIDADE?(ISSO PODE SER MODIFICADO QUANTAS
                        VEZES QUISER)</Text>
                        <TextInput
                            style={styles.inputMenor}
                            placeholder='Dias disponíveis'
                            autoCapitalize="none"
                            placeholderTextColor="rgb(87, 128, 178)"
                            value={this.state.disp}
                            onChangeText={val => this.onChangeText('disp', val)}
                        />
                    </View>

                    <Button
                        title='Selecionar Avatar'
                        onPress={this.carregarImagem}
                        buttonStyle={styles.botaoImage}
                    />
                    <View style={styles.container}>
                        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
                    </View>

                    <Button
                        title='Cadastrar'
                        onPress={this.signUp}
                        buttonStyle={styles.botao}
                    />
                </View>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: "rgb(87, 128, 178)",
        borderBottomWidth: 2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        width: (Dimensions.get('window').width) * 8 / 10,
        margin: 10
    },
    inputMenor: {
        borderColor: "rgb(87, 128, 178)",
        borderBottomWidth: 2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        width: (Dimensions.get('window').width) * 6 / 10,
        margin: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerPicker: {
        marginVertical: 15,
        width: (Dimensions.get('window').width) * 8 / 10,
        padding: 10,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderColor: "rgb(87, 128, 178)",
        borderWidth: 2,
    },
    pickerEstilo: {
        color: "rgb(87, 128, 178)",
        width: (Dimensions.get('window').width) * 7 / 10,
    },
    texto: {
        color: "rgb(87, 128, 178)",
    },
    botao: {
        alignItems: 'center',
        backgroundColor: "rgb(87, 128, 178)",
        borderRadius: 20,
        width: (Dimensions.get('window').width) * 8 / 10,
        margin: 15
    },
    botaoImage: {
        alignItems: 'center',
        backgroundColor: "rgb(87, 128, 178)",
        width: (Dimensions.get('window').width) * 8 / 10,
    },
    uploadAvatar: {
        width: (Dimensions.get('window').width) * 8 / 10,
        height: (Dimensions.get('window').height) * 5 / 10,
        borderColor: "rgb(87, 128, 178)",
        borderWidth: 2,
    }
})