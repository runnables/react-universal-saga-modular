import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Explore } from 'components';
import {
  navigate,
  updateRouterState,
  resetErrorMessage
} from 'modules/common/actions';
import { firebaseMessagesRef, firebaseAuth, firebaseAuthProvider } from 'services/firebase';

import styles from './App.scss'; // eslint-disable-line

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      items: []
    };
    this.items = [];
  }

  componentWillMount() {
    this.props.updateRouterState({
      pathname: this.props.location.pathname,
      params: this.props.params
    });
    this.messagesRef = firebaseMessagesRef;
    this.auth = firebaseAuth;
    this.auth.onAuthStateChanged((user) => this.onAuthStateChanged(user));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage && this.props.errorMessage !== nextProps.errorMessage) {
      // handle error here
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.updateRouterState({
        pathname: nextProps.location.pathname,
        params: nextProps.params
      });
    }
  }

  componentWillUnmount() {
    this.messagesRef.off();
  }

  onAuthStateChanged(user) {
    this.setState({ user });
    if (user) {
      this.messagesRef.off();
      this.messagesRef.limitToLast(12).on('child_added', (data) => this.setItems(data));
      this.messagesRef.limitToLast(12).on('child_changed', (data) => this.setItems(data));
    }
  }

  setItems(dataSnapshot) {
    this.items.push(dataSnapshot.val());
    this.setState({
      items: this.items
    });
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage();
    e.preventDefault();
  }

  handleSignInClick(e) {
    const provider = new firebaseAuthProvider.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
    e.preventDefault();
  }

  handleChange(nextValue) {
    this.props.navigate(`/${nextValue}`);
  }

  renderMessages() {
    return _.map(this.state.items, (message, id) => (
      <div key={id}>
        <img src={message.photoUrl} className={styles.profile} />
        <div><b>{message.name}</b></div>
        <div>{message.text}</div>
      </div>
    ));
  }

  render() {
    const { children, inputValue } = this.props;
    console.log('firebaseItems:', this.state.items);
    return (
      <div className={styles.app}>
        <Helmet
          title="React Universal Saga Modular"
          meta={[{ property: 'og:site_name', content: 'React Universal Saga Modular' }]}
        />
        <div onClick={(e) => this.handleSignInClick(e)} style={{ cursor: 'pointer' }}>Sign in</div>
        {this.renderMessages()}
        <Explore value={inputValue} onChange={this.handleChange} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  inputValue: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  updateRouterState: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  params: PropTypes.object
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    inputValue: state.router.pathname.substring(1)
  };
}

export default connect(mapStateToProps, {
  navigate,
  updateRouterState,
  resetErrorMessage
})(App);
