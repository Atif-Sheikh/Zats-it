/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';

export default class Meeting extends Component {
  state = {
    pickName: '',
  };
  url = 'https://awesome.contents.com/';
  title = 'Awesome Contents';
  message = 'Please check this out.';
  icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  options = Platform.select({
    android: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: {type: 'url', content: this.url},
          item: {
            default: {type: 'url', content: this.url},
          },
          subject: {
            default: this.title,
          },
          linkMetadata: {originalUrl: this.url},
        },
        {
          // For sharing text.
          placeholderItem: {type: 'text', content: this.message},
          item: {
            default: {type: 'text', content: this.message},
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: {
            // For showing app icon on share preview.
            title: this.message,
          },
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: this.icon,
          },
          item: {
            default: {
              type: 'text',
              content: `${this.message}`,
            },
          },
          linkMetadata: {
            title: this.message,
            icon: this.icon,
          },
        },
      ],
    },
    default: {
      // title,
      subject: this.title,
      message: `${this.message} ${this.url}`,
    },
  });

  createMeeting = id => {
    this.props.navigation.navigate('Room', {id, type: false});
    this.setState({pickName: ''});
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f0'}}>
        <View style={styles.head}>
          <Image style={styles.tinyLogo} source={require('../../zatsit.png')} />
          <Text style={{fontSize: 30, color: 'green'}}>
            Create or join audio/video call
          </Text>
        </View>
        <View style={styles.bottom}>
          <TextInput
            label="Pick Name"
            style={{
              borderWidth: 2, // size/width of the border
              borderColor: 'lightgrey', // color of the border
              paddingLeft: 10,
              height: 60,
              width: '90%',
              borderRadius: 5,
            }}
            placeholder="Enter Room Name"
            // returnKeyType='next'
            onChangeText={value => this.setState({pickName: value})}
            value={this.state.pickName}
          />
          <TouchableOpacity
            style={[
              styles.botton,
              {backgroundColor: this.state.pickName ? '#008000' : '#ccc'},
            ]}
            onPress={() => {
              this.state.pickName.length >= 1 &&
                this.createMeeting(this.state.pickName.trim());
            }}>
            <Text style={{color: '#fff'}}> Create the chat room </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  head: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // width:'90%',
    backgroundColor: '#fff',
    marginHorizontal: '10%',
    borderRadius: 10,
    marginBottom: 20,
  },
  botton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 50,
  },
  tinyLogo: {
    aspectRatio: 6,
    resizeMode: 'contain',
    width: '100%',
    height: 40,
    marginVertical: 5,
  },
  bottomButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
    color: 'green',
    fontSize: 25,
  },
});
