import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Keyboard, BackHandler, Platform } from 'react-native';
import { Header } from "native-base";
import Note from '../models/Note';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createNote } from '../controllers/NoteController';
import alertService from '../service/alertService';

export default class AddNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note: new Note(),
            event: this.props.event,
        };
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.createNote);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * change note text
     */
    changeTxt = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.detail = text;
        this.setState({ note });
        // this.createNote();
    }

    /**
     * change note title
     */
    changeTxtTitle = (text) => {
        let note = this.state.note;
        if (!note) return;

        note.title = text;
        this.setState({ note });
        // this.createNote();
    }

    /**
     * @param {*} note detail
     * add note
     */
    createNote = () => {
        console.log('this.state.note: ', this.state.note);
        if (!this.state.note.detail && !this.state.note.title) {
            // ToastAndroid.show("Empty note discarded.", ToastAndroid.SHORT);
            alertService.alerAndToast("Empty note discarded");
        } else {
            this.state.note.hasCheckList = this.props.navigation.state.params.hasCheckList;
            createNote(this.state.note).then(({ result, message }) => {
                // console.log('result:', result);
                // console.log('state', this.state.note);
                // ToastAndroid.show(message, ToastAndroid.SHORT);
                // alertService.alerAndToast(message);
                console.log('meaasge:', message);
                if (result) {
                    this.setState({ note: new Note() });
                    this.props.navigation.state.params.event.emit('onCreateNote');
                }
                // this.props.navigation.navigate('Home');
            });
        }
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.createNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="arrow-back" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 8 }}></View>
                    <View style={{ flex: 2 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.createNote(); this.props.navigation.navigate('Home') }}>
                            <Icon name="check" size={28} color="#606060" />
                        </TouchableOpacity>
                    </View>
                </Header>
                <SafeAreaView>
                    <View style={styles.container}>
                        <ScrollView scrollToOverflowEnabled={true} style={{ marginTop: Platform.OS == 'ios' ? 10 : null }}>
                            <TextInput
                                style={[styles.input, styles.titleFontSize]}
                                onChangeText={(text) => this.changeTxtTitle(text)}
                                placeholder={'Title'}
                                multiline={true}
                                onSubmitEditing={this.createNote}
                                blurOnSubmit={true}
                            />
                            <TextInput
                                style={[styles.input, styles.generalFontSize]}
                                onChangeText={(text) => this.changeTxt(text)}
                                placeholder={'Note'}
                                multiline={true}
                                // onSubmitEditing={this.createNote}
                                autoFocus={true}
                                multiline={true}
                                blurOnSubmit={true}
                            />
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: Platform.OS == 'ios' ? null : 20,
        paddingBottom: Platform.OS == 'ios' ? 20 : null,
        paddingRight: Platform.OS == 'ios' ? 20 : null,
        paddingLeft: Platform.OS == 'ios' ? 20 : null,
        height: 'auto',
    },
    header: {
        backgroundColor: "#ffffff",
        height: 50,
        borderBottomColor: Platform.OS == 'ios' ? null : '#000',
        borderBottomWidth: Platform.OS == 'ios' ? null : 1,
        marginTop: Platform.OS == 'ios' ? 20 : null
    },
    iconButton: {
        height: 50,
        width: 50,
        top: Platform.OS === 'ios' ? null : 20
    },
    input: {
        width: '100%',
        borderBottomColor: '#800080',
        marginHorizontal: 5,
    },
    generalFontSize: {
        fontSize: 20,
    },
    titleFontSize: {
        fontSize: 30,
    }
});