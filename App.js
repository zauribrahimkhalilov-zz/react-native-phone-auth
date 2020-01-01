import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      message: '',
      code_sent: null,
      confirm_result: null,
      loggedin: false
    }
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedin: user.toJSON() });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signup = () => {

    const { phone } = this.state;

    this.setState({ message: 'Sending code ...' });

    auth().signInWithPhoneNumber(phone)
      .then(confirm_result => this.setState({ confirm_result, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  }

  confirmCode = () => {
    const { code_input, confirm_result } = this.state;

    if (confirm_result && codeInput.length) {
      confirm_result.confirm(code_input)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  }

  signOut = () => {
    auth().signOut();
  }

  renderSignup = () => {

    const { phone } = this.state;

    return (
      <View style={styles.view}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({ phone: text })}
          placeholder={"Phone number"}
          value={phone}
        />
        <Button
          title="Submit"
          onPress={() => this.signup()}
        />
      </View>
    );

  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={styles.messageText}>{message}</Text>
    );
  }

  renderVerificationCode = () => {

    const { code_input } = this.state;

    return (
      <View style={styles.view}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({ code_input: text })}
          placeholder={"Verification code"}
          value={code_input}
        />
        <Button
          title="Confirm"
          onPress={() => this.confirmCode()}
        />
      </View>
    );

  }

  render() {

    const { code_sent, loggedin } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#dfdfdf' }}>
        <View style={{ flex: 1 }}></View>
        {!code_sent && this.renderSignup()}
        {this.renderMessage()}
        {code_sent && this.renderVerificationCode()}
        <View style={{ flex: 1 }}></View>
        {loggedin && (
          <View style={{flex: 1}}>
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(loggedin)}</Text>
            <Button title="Sign Out" color="red" onPress={this.signOut} />
          </View>
        )}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  textInput: {
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  messageText: {
    padding: 5, 
    backgroundColor: '#0000ff', 
    color: '#fff'
  }
});