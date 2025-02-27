import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Auth from '../../../TdWeb/auth';
import connectionStore from '../../../TdWeb/connectionStore';
import ConfirmDialog from '../../../ui/dialog/confirm-dialog';
import { addDialog } from '../../../ui/dialog/dialogs';
import BigHighlightedButton from '../../../ui/elements/highlighted-button';
import UnderlinedInput from '../../../ui/elements/underlined-input';
import ConnectionState from '../../../ui/components/connecting';
import TdLib from '../../../TdWeb/tdlib';
import LinkButton from '../../../ui/elements/link-button';
import SignUpProfilePic from './signup-profile-photo';
import './register.scss';
import __, { __fmt } from '../../../language-pack/language-pack';

/**
 * Render sign up step of authorization screen
 */
export default class AuthWindowStepRegister extends React.Component {
    static propTypes= {
        tos: PropTypes.object,
    }
    
    state= {
        firstName: '',
        lastName: '',
        statusContent: '',
        statusVisible: false,
        image: null,
    };
    handleFirstNameFieldChange= (event) => {
        this.setState({firstName: event.target.value});
    }
    handleLastNameFieldChange= (event) => {
        this.setState({lastName: event.target.value});
    }
    handleContinueButton= () => {
        Auth.registerNewAccount(this.state.firstName, this.state.lastName).catch(reason=> {
            this.setState({textUnderField: reason.message});
        }).then(()=> {
            if(this.state.image) {
                TdLib.sendQuery({
                    '@type': 'setProfilePhoto',
                    photo: {
                        '@type': 'inputChatPhotoStatic',
                        photo: {
                            '@type': 'inputFileBlob',
                            data: this.state.image,
                        }
                    }
                });
            }
        });
    }

    showTos= () => {
        addDialog('signup-tos-dialog', (
            <ConfirmDialog id="signup-tos-dialog" width="364px"
                hideCancelButton={true} title={__('lng_terms_header')}>
                
                {this.props.tos.text.text}
            </ConfirmDialog>
        ));
    }

    render () {
        return (
            <div className="auth-container">
                <div id="auth" className="auth-step-signup">
                    <div className="content">

                        <h2>{__('lng_signup_title')}</h2>

                        <p className="description">{__('lng_signup_desc')}</p>

                        <SignUpProfilePic image={this.state.image} onChange={e=> this.setState({
                            image: e.target.files[0]
                        })}/>

                        <UnderlinedInput
                            type="text" 
                            title={__('lng_signup_firstname')}
                            value={this.state.firstName} 
                            onChange={this.handleFirstNameFieldChange}
                            autoFocus={true} />

                        <UnderlinedInput 
                            type="text" 
                            title={__('lng_signup_lastname')}
                            value={this.state.lastName} 
                            onChange={this.handleLastNameFieldChange} />

                        <div className="status">
                            {this.state.textUnderField || ''}
                        </div>

                        <BigHighlightedButton
                            onClick={this.handleContinueButton}>
                            {__('lng_intro_finish')}
                        </BigHighlightedButton>

                    </div>
                    <Provider store={connectionStore}>
                        <ConnectionState/>
                    </Provider>
                </div>
                <div className="tos-notice">
                    {__fmt('lng_terms_signup', {link: <LinkButton onClick={this.showTos}>{__('lng_terms_signup_link')}</LinkButton>})} 
                </div>
            </div>
        );
    }
}