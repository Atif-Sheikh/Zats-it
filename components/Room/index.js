/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import JitsiMeet, {
  JitsiMeetView as RNJitsiMeetView,
} from 'react-native-jitsi-meet';

class JitsiMeetView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('url', this.props.route.params);
      const url = `https://meet.shutar.com/${this.props.route.params.id}`;
      console.log(url, 'urlll');
      const userInfo = {
        displayName: 'User',
        email: 'user@example.com',
        avatar: 'https:/gravatar.com/avatar/abc123',
      };
      if (this.props.route.params.type) {
        JitsiMeet.audioCall(url, userInfo);
        //
      } else {
        JitsiMeet.call(url, userInfo);
      }

      /* Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio */
      /* Você pode terminar programaticamente a chamada com JitsiMeet.endCall () */
    }, 1000);
  }

  componentWillUnmount() {
    JitsiMeet.endCall();
  }

  // Jitsi Update Timeout needs to be called every 10 seconds to make sure
  // call is not ended and is available to web users.
  onConferenceJoined = () => {};

  onConferenceTerminated = () => {
    this.props.navigation.navigate('Meeting');
  };

  render() {
    return (
      <RNJitsiMeetView
        onConferenceTerminated={this.onConferenceTerminated}
        onConferenceJoined={this.onConferenceJoined}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
      />
    );
  }
}

export default JitsiMeetView;
