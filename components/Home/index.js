/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Image,
  TextInput,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Icon} from 'native-base';
import Contacts from 'react-native-contacts';
import Communications from 'react-native-communications';

import ListItem from '../ListItem';
import Avatar from '../Avatar';
import SearchBar from '../SearchBar';

const {height, fontScale} = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);

    this.state = {
      contacts: [],
      searchPlaceholder: 'Search',
      typeText: null,
      loading: true,
      modalVisibility: false,
      contactName: '',
      sendMsg: false,
    };

    // if you want to read/write the contact note field on iOS, this method has to be called
    // WARNING: by enabling notes on iOS, a valid entitlement file containing the note entitlement as well as a separate
    //          permission has to be granted in order to release your app to the AppStore. Please check the README.md
    //          for further information.
    Contacts.iosEnableNotesUsage(true);
  }

  ShowModalFunction(visible, sendMsg) {
    this.setState({modalVisibility: visible, sendMsg});
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        this.loadContacts();
      });
    } else {
      this.loadContacts();
    }
  }

  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.warn('Permission to access contacts was denied');
      } else {
        this.setState({contacts, loading: false});
      }
    });

    Contacts.getCount(count => {
      this.setState({searchPlaceholder: `Search ${count} contacts`});
    });
  }

  search(text) {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === '' || text === null) {
      this.loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
        this.setState({contacts});
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text, (err, contacts) => {
        this.setState({contacts});
      });
    } else {
      Contacts.getContactsMatchingString(text, (err, contacts) => {
        this.setState({contacts});
      });
    }
  }

  enterChatRoom = contact => {
    try {
      const {navigation} = this.props;
      const {displayName, phoneNumbers} = contact;
  
      let number = phoneNumbers[0].number;
  
      navigation.navigate('Chat', {
        name: displayName,
        number,
      });
    }catch(err) {
      console.log(err, "ERROR");
    }
  };

  phonenumber = inputtxt => {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (inputtxt.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  };

  onPressContact(contact) {
    var text = this.state.typeText;
    this.setState({typeText: null});
    if (text === null || text === '') {
      Contacts.openExistingContact(contact, () => {});
    } else {
      var newPerson = {
        recordID: contact.recordID,
        phoneNumbers: [{label: 'mobile', number: text}],
      };
      Contacts.editExistingContact(newPerson, (err, contact) => {
        if (err) {
          throw err;
        }
        //contact updated
      });
    }
  }

  sendMessage = () => {
    const {typeText} = this.state;

    if (!typeText) {
      Alert.alert('Please enter correct details!');
      return;
    }
    Communications.text(typeText);
  };

  addContact = sendMsg => {
    const {typeText} = this.state;

    if (!typeText) {
      Alert.alert('Please enter correct details!');
      return;
    }

    if (sendMsg) {
      Communications.phonecall(typeText, true);
    } else {
      let newPerson = {
        phoneNumbers: [
          {
            label: 'mobile',
            number: typeText,
          },
        ],
      };
      Contacts.openContactForm(newPerson, err => {
        if (err) {
          console.warn(err);
        }
        // form is open
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {modalVisibility, sendMsg} = this.state;

    Platform.OS === 'android' && StatusBar.setBarStyle('light-content', true);
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#08a5ed');

    return (
      <View style={styles.container}>
        <View
          style={{
            paddingLeft: 100,
            paddingRight: 100,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#08a5ed',
          }}>
          <Image
            source={require('../../zatsit.png')}
            style={{
              aspectRatio: 6,
              resizeMode: 'contain',
              width: '100%',
              height: 40,
              marginVertical: 5,
            }}
          />
        </View>
        <SearchBar
          searchPlaceholder={this.state.searchPlaceholder}
          onChangeText={this.search}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Meeting')}
          style={{position: 'absolute', left: 20, top: 10}}>
          <Icon
            style={{opacity: 0.5, fontSize: fontScale * 28}}
            name="videocam"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.ShowModalFunction(true, true)}
          style={{position: 'absolute', right: 60, top: 10}}>
          <Icon style={{opacity: 0.5, fontSize: fontScale * 28}} name="call" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.ShowModalFunction(true, false)}
          style={{position: 'absolute', right: 20, top: 10}}>
          <Icon
            style={{opacity: 0.5, fontSize: fontScale * 28}}
            name="contacts"
          />
        </TouchableOpacity>

        {this.state.loading === true ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView style={{flex: 1}}>
            {this.state.contacts.map(contact => {
              return (
                <ListItem
                  leftElement={
                    <Avatar
                      img={
                        contact.hasThumbnail
                          ? {uri: contact.thumbnailPath}
                          : undefined
                      }
                      placeholder={getAvatarInitials(
                        `${contact.givenName} ${contact.familyName}`,
                      )}
                      width={40}
                      height={40}
                    />
                  }
                  //   rightText={'View'}
                  rightElement={
                    <TouchableOpacity
                      onPress={() => this.enterChatRoom(contact)}>
                      <Icon
                        style={{opacity: 0.5, fontSize: fontScale * 30}}
                        name="md-eye"
                      />
                    </TouchableOpacity>
                  }
                  key={contact.recordID}
                  title={`${contact.givenName} ${contact.familyName}`}
                  description={`${contact.company}`}
                  onPress={() => {}}
                  // onPress={() => navigation.navigate('Chat')}
                  onDelete={() =>
                    Contacts.deleteContact(contact, () => {
                      this.loadContacts();
                    })
                  }
                />
              );
            })}
          </ScrollView>
        )}

        <Modal
          animationType={'slide'}
          visible={modalVisibility}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.modalVisibility);
          }}>
          <View style={styles.modalView}>
            <View style={{paddingLeft: 10, paddingRight: 10}}>
              {/* <TextInput
                style={styles.inputStyle}
                placeholder="Enter contact name"
                onChangeText={text => this.setState({contactName: text})}
                value={this.state.contactName}
              /> */}
            </View>
            <View style={{alignItems: 'center', maxHeight: 100, width: '100%'}}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter number"
                onChangeText={text => this.setState({typeText: text})}
                value={this.state.typeText}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.addContact(sendMsg)}
              style={styles.addContact}>
              <Text style={{fontSize: 16}}>
                {sendMsg ? 'Call' : 'Add Contact'}
              </Text>
            </TouchableOpacity>

            {sendMsg ? (
              <TouchableOpacity
                onPress={() => this.sendMessage()}
                style={styles.addContact}>
                <Text style={{fontSize: 16}}>Send Message</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => this.ShowModalFunction(false)}
              style={{
                position: 'absolute',
                right: 5,
                top: 10,
                width: 50,
                height: 50,
                alignItems: 'center',
              }}>
              <Icon
                style={{opacity: 0.5, fontSize: fontScale * 40}}
                name="close"
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    height: 50,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 2,
    marginTop: 20,
    textAlign: 'left',
    borderRadius: 10,
  },
  addContact: {
    height: 50,
    marginTop: 20,
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    borderRadius: 10,
  },
});

const getAvatarInitials = textString => {
  if (!textString) {
    return '';
  }

  const text = textString.trim();

  const textSplit = text.split(' ');

  if (textSplit.length <= 1) {
    return text.charAt(0);
  }

  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

  return initials;
};
