import React, { Component } from 'react';
import {
    View, FlatList, TouchableHighlight, StyleSheet, Dimensions, AsyncStorage, Alert, Image
} from 'react-native';

import Api from '../../services/Api';
import { Container, TextInfo } from '../Note/Style';
import { AppColors } from '../../colors/AppColors';
import BagsImage from '../../../assets/bags.png';

var { width, height } = Dimensions.get('window');
var SCREEN_WIDTH = width < height ? width : height;
var recipeNumColums = 2;
var RECIPE_ITEM_HEIGHT = 150;
var RECIPE_ITEM_MARGIN = 20;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nfces: [],
            isLoading: false,
            errorMessage: null,
            uniqueNames: []
        }
    }

    async componentDidMount() {
        this.getNfces();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.nfces !== this.state.nfces)
            this.getNfces();
    }

    getNfces = async () => {
        try {
            const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const response = await Api.get('/nfces/user/' + _id);

            const { nfces } = response.data;
            const grouped = this.groupBy(nfces, nfce => nfce.socialName);
            const notes = [];

            this.listNameItems(nfces);
            const { uniqueNames } = this.state;

            uniqueNames.map((value, key) => {
                const group = grouped.get(value);
                notes.push({ key: key, name: value, list: group });
            });

            this.setState({ nfces: notes });
        } catch (response) {
            this.setState({ errorMessage: response })
        }
    }

    listNameItems = (nfces) => {
        const names = nfces.map(nfce => nfce.socialName);
        const uniqueNames = [...new Set(names)];
        this.setState({ uniqueNames });
    }

    groupBy = (list, keyGetter) => {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    onPressNfce = list => {
        this.setState({ isLoading: true })
        this.props.navigation.navigate('NoteScreen', { nfces: list });
        this.setState({ isLoading: false })
    };

    renderNfce = ({ item }) => (
        <TouchableHighlight underlayColor='transparent' onPress={() => this.onPressNfce(item.list)}>
            <View style={styles.container}>
                <TextInfo color={AppColors.textBold}>{item.name.toUpperCase()}</TextInfo>
                <TextInfo color={AppColors.text}>Qtde de notas: {item.list.length}</TextInfo>
                <Image style={styles.image} source={BagsImage} />
                <TextInfo color={AppColors.text}>Total: R$ {item.list.reduce((total, number) => {
                    return total + parseFloat(number.totalValue, 10);
                }, 0).toFixed(2)}
                </TextInfo>
            </View>
        </TouchableHighlight>
    );

    render() {
        return (
            <Container background={AppColors.background}>
                { this.state.nfces.length > 0 ?
                    <FlatList
                        vertical
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        data={this.state.nfces}
                        renderItem={this.renderNfce}
                        keyExtractor={item => `${item.key}`}
                    />
                    : <TextInfo color={AppColors.text}></TextInfo>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        marginLeft: RECIPE_ITEM_MARGIN,
        marginTop: 20,
        width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
        height: RECIPE_ITEM_HEIGHT + 60,
        borderColor: AppColors.invoice,
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: AppColors.backgroundWindow
    },
    image: {
        width: ((SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums) / 2,
        height: RECIPE_ITEM_HEIGHT / 2,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    }
})