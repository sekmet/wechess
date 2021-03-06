import {Accounts} from 'meteor/accounts-base';

import { push } from 'react-router-redux';

export default {

  login({Meteor, Store}, email, password, callback) {
    const i18n = Store.getState().i18n;

    if (!email || !password) {
      return Store.dispatch({
        type: 'SET_LOGIN_ERROR',
        message: i18n.MessageEmptyEmailOrPassword,
      });
    }

    Store.dispatch({
      type: 'SET_LOGIN_ERROR',
      message: null,
    });

    Meteor.loginWithPassword(email, password, (err) => {
      if (err && err.reason) {
        return Store.dispatch({
          type: 'SET_LOGIN_ERROR',
          message: err.reason,
        });
      }

      if (callback){
        callback.apply();
      }else{
        Store.dispatch(push("/"));
      }
    });
  },

  loginErrorClear({Store}) {
    return Store.dispatch({
      type: 'SET_LOGIN_ERROR',
      message: null,
    });
  },

  register({Meteor, Store}, email, password1, password2, callback) {
    const i18n = Store.getState().i18n;

    if (!email || !password1 || !password2) {
      return Store.dispatch({
        type: 'SET_REGISTER_ERROR',
        message: i18n.MessageFillAllMandatoryFields,
      });
    }

    if (password1 !== password2 ) {
      return Store.dispatch({
        type: 'SET_REGISTER_ERROR',
        message: i18n.MessagePasswordNotMatch,
      });
    }

    Accounts.createUser({email, password: password1}, (err) => {
      if (err && err.reason) {
        return Store.dispatch({
          type: 'SET_REGISTER_ERROR',
          message: err.reason,
        });
      }

      const locale = Store.getState().locale;
      const subject = i18n.VerificationSubject;

      Meteor.call( 'sendVerificationLink', locale, subject, ( error, response ) => {
        if ( error ) {
          return Store.dispatch({
            type: 'SET_REGISTER_ERROR',
            message: error.reason,
          });
        } else {
          Bert.alert( i18n.MessageVerificationSentSuccessfully, 'success' );
          if (callback){
            callback.apply();
          }else{
            Store.dispatch(push("/"));
          }
        }
      });
    });
  },

  registerErrorClear({Store}) {
    return Store.dispatch({
      type: 'SET_REGISTER_ERROR',
      message: null,
    });
  },


  loginWithFacebook({Meteor, Store}, callback){
    Meteor.loginWithFacebook( {
      requestPermissions: [ 'email' ]
    }, ( error ) => {
      if ( error ) {
        return Store.dispatch({
          type: 'SET_LOGIN_ERROR',
          message: error.message,
        });
      }
      if (callback){
        callback.apply();
      }else{
        Store.dispatch(push("/"));
      }
    });
  },

  loginWithTwitter({Meteor, Store}, callback){
    Meteor.loginWithTwitter( {}, ( error ) => {
      if ( error ) {
        return Store.dispatch({
          type: 'SET_LOGIN_ERROR',
          message: error.message,
        });
      }
      if (callback){
        callback.apply();
      }else{
        Store.dispatch(push("/"));
      }
    });
  },

  loginWithGoogle({Meteor, Store}, callback){
    Meteor.loginWithGoogle( {
      requestPermissions: [ 'email' ]
    }, ( error ) => {
      if ( error ) {
        return Store.dispatch({
          type: 'SET_LOGIN_ERROR',
          message: error.message,
        });
      }
      if (callback){
        callback.apply();
      }else{
        Store.dispatch(push("/"));
      }
    });
  },

  loginWithGithub({Meteor, Store}, callback){
    Meteor.loginWithGithub( {
      requestPermissions: [ 'email' ]
    }, ( error ) => {
      if ( error ) {
        return Store.dispatch({
          type: 'SET_LOGIN_ERROR',
          message: error.message,
        });
      }
      if (callback){
        callback.apply();
      }else{
        Store.dispatch(push("/"));
      }
    });
  },

  password({Meteor, Store}, email, callback) {
    const i18n = Store.getState().i18n;

    if (!email) {
      return Store.dispatch({
        type: 'SET_PASSWORD_ERROR',
        message: i18n.MessageEmptyEmail,
      });
    }

    Store.dispatch({
      type: 'SET_PASSWORD_ERROR',
      message: null,
    });

    const emailNotExisting = i18n.EmailNotExisting;
    const subject = i18n.ResetPasswordSubject;
    const locale = Store .getState().locale;

    Meteor.call( 'sendResetPasswordLink', email, emailNotExisting, locale, subject, ( error, response ) => {

      if ( error ) {
        return Store.dispatch({
          type: 'SET_PASSWORD_ERROR',
          message: error.reason,
        });
      } else {
        Bert.alert( i18n.MessageResetPasswordEmailSent, 'success' );
      }
    });
  },

  passwordErrorClear({Store}) {
    return Store.dispatch({
      type: 'SET_PASSWORD_ERROR',
      message: null,
    });
  },

  resetPassword({Meteor, Store}, token, password, confirmPassword, callback) {
    const i18n = Store.getState().i18n;

    if (!token){
      return Store.dispatch({
        type: 'SET_RESET_PASSWORD_ERROR',
        message: i18n.MessageEmptyResetPasswordToken,
      });
    }

    if (!password || !confirmPassword ) {
      return Store.dispatch({
        type: 'SET_RESET_PASSWORD_ERROR',
        message: i18n.MessageEmptyPasswordOrConfirm,
      });
    }

    if ( password != confirmPassword ) {
      return Store.dispatch({
        type: 'SET_RESET_PASSWORD_ERROR',
        message: i18n.MessagePasswordNotMatchConfirm,
      });
    }

    Store.dispatch({
      type: 'SET_RESET_PASSWORD_ERROR',
      message: null,
    });

    Accounts.resetPassword(token, password, function(error) {
      if (error) {
        console.log("error", error, error.reason);
        return Store.dispatch({
          type: 'SET_RESET_PASSWORD_ERROR',
          message: i18n.MessageSomethingWrong,
        });
      } else {
        Bert.alert( i18n.MessagePasswordResetSuccess, 'success' );
      }
    });

    //Meteor.call( 'resetPassword', token, password, ( error, response ) => {
    //
    //  if ( error ) {
    //    return LocalState.set('RESET_PASSWORD_ERROR', error.reason);
    //  } else {
    //    Bert.alert( 'Password reset successfully.', 'success' );
    //  }
    //});
  },

  resetPasswordErrorClear({Store}) {
    return Store.dispatch({
      type: 'SET_RESET_PASSWORD_ERROR',
      message: null,
    });
  },

};
