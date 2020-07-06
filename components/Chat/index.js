import React, {Component} from 'react';
import {
  Text,
  Item,
  Input,
  Icon,
  Header,
  Left,
  Button,
  Body,
  Title,
  Right,
} from 'native-base';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Communications from 'react-native-communications';

const {height} = Dimensions.get('window');

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  onPress = () => {
    const {
      route: {
        params: {number},
      },
    } = this.props;
    let {message} = this.state;

    if (!message) {
      Alert.alert('Please enter message');
      return;
    }

    Communications.text(number);
  };

  componentDidMount() {}

  render() {
    const {
      route: {
        params: {name, number},
      },
      navigation,
    } = this.props;

    Platform.OS === 'android' && StatusBar.setBarStyle('light-content', true);
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#08a5ed');

    return (
      <View style={style.container}>
        <Header
          androidStatusBarColor="#08a5ed"
          style={{backgroundColor: '#08a5ed'}}>
          <Left>
            <Button onPress={() => navigation.goBack()} transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{name}</Title>
          </Body>
          <Right style={{paddingLeft: 20}}>
            <TouchableOpacity onPress={() => {}}>
              <Icon name="videocam" style={{color: '#fff', marginRight: 30}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Communications.phonecall(number, true)}>
              <Icon name="call" style={{color: '#fff', marginRight: 20}} />
            </TouchableOpacity>
          </Right>
        </Header>
        <ScrollView>
          {this.state.messages &&
            this.state.messages.map((val, ind) => {
              return (
                <View key={ind}>
                  <View
                    style={
                      val.email && val.email === this.props.user.email
                        ? {
                            width: 200,
                            borderRadius: 10,
                            margin: 2,
                            padding: 8,
                            alignSelf: 'flex-end',
                          }
                        : {
                            backgroundColor: '#B2CBBF',
                            marginTop: 2,
                            width: 200,
                            borderRadius: 10,
                            margin: 2,
                            padding: 8,
                            alignSelf: 'flex-start',
                          }
                    }>
                    <Text style={{color: '#a10000'}}>{val.msg}</Text>
                    <Text style={{color: '#a10000'}} note>
                      {moment(val.time).fromNow()}
                    </Text>
                  </View>
                </View>
              );
            })}
          {!this.state.messages.length ? (
            <Text
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                color: 'grey',
                marginTop: 30,
              }}>
              No Message
            </Text>
          ) : null}
        </ScrollView>
        <Item style={{width: '100%', height: height / 12}} regular>
          <Input
            value={this.state.message}
            onChangeText={message => this.setState({message})}
            style={{width: '80%'}}
            placeholder="Write your Message here"
          />
          <TouchableOpacity
            onPress={this.onPress}
            style={{
              justifyContent: 'center',
              width: '20%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16}}>Send</Text>
          </TouchableOpacity>
        </Item>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  commentContainer: {
    flex: 2,
    backgroundColor: 'green',
  },
});

export default ChatRoom;
