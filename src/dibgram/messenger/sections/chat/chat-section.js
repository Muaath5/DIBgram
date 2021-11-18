import React from 'react';
import { connect, Provider } from 'react-redux';
import __ from '../../../language-pack/language-pack';
import { ServiceMessage } from '../../message/ui/message-containers';
import TitleHeader from './headers/title';
import './chat-section.scss';
import usersStore from '../../users-store';
import supergroupStore from '../../supergroup-store';
import basicGroupStore from '../../basic-group-store';
import IconButton from '../../../ui/elements/icon-button';
import { input_attach, input_send, settings_advanced } from '../../../ui/icon/icons';

export const ChatSection= 
connect(({chats, selectedChat}) => ({chats, selectedChat})) (function ChatSection({chats, selectedChat}) {
    let chat;
    for(let c of chats) {
        if(c.id === selectedChat) {
            chat = c;
            break;
        }
    }

    if(!chat) return (
        <div id="chat-section" className="no-chat">
            <ServiceMessage>
                {__('lng_willbe_history')}
            </ServiceMessage>
        </div>
    );
    switch(chat.type['@type']){
    case 'chatTypePrivate':
        return (
            <Provider store={usersStore}>
                <ChatSectionContentWrapperPrivate chat={chat}/>
            </Provider>
        );
    case 'chatTypeBasicGroup': 
        return (
            <Provider store={basicGroupStore}>
                <ChatSectionContentWrapperBasicGroup chat={chat}/>
            </Provider>
        );
    case 'chatTypeSupergroup':
        return (
            <Provider store={supergroupStore}>
                <ChatSectionContentWrapperSupergroup chat={chat}/>
            </Provider>
        );
    }
});

const ChatSectionContentWrapperPrivate= connect(users=>({users}))(
    function ChatSectionContentWrapperPrivate({users, chat}) {
        return <ChatSectionContentWrapper user={users[chat.type.user_id]} chat={chat}/>;
    }
);

const ChatSectionContentWrapperBasicGroup= connect(basicGroups=>({basicGroups}))(
    function ChatSectionContentWrapperBasicGroup({basicGroups, chat}) {
        return <ChatSectionContentWrapper basicGroup={basicGroups[chat.type.basic_group_id]} chat={chat}/>;
    }
);

const ChatSectionContentWrapperSupergroup= connect(supergroups=>({supergroups}))(
    function ChatSectionContentWrapperSupergroup({supergroups, chat}) {
        return <ChatSectionContentWrapper chat={chat} supergroup={supergroups[chat.type.supergroup_id]}/>;
    }
);

function ChatSectionContentWrapper(props) {
    return (
        <div id="chat-section">
            <div className="headers">
                <TitleHeader {...props}/>
            </div>
            <div className="messages">
                {/* These types of messages should be implemented, And inherit from <Message> which is a <div> with needed styles: */}
                {/*<Message content={MessageContentText} />  ###Should work on this###*/}
                {/*<Message content={MessageContentPhoto} /> */}
                {/*<Message content={MessageContentVideo} /> */}
                {/*<Message content={MessageContentDocument} /> */}
                {/*<Message content={MessageContentInvoice} />*/}
                {/*<Message content={MessageContentSponsored} /> // This should depend on <MessageText>, This needs getSponsoredMessages*/}
                {/*<MessageSticker id={number} /> // For both animated and static*/}
                {/*<MessageUnsupported/>*/}
            </div>
            <div className="bottom">
                {(!false) && (
                    <div className="input">
                        <IconButton icon={input_attach} />
                        <input className="input-field" placeholder={__('lng_message_ph')} />
                        <IconButton icon={settings_advanced} /> {/* Icon has problem in TDesktop */}
                        <IconButton icon={input_send} ripple={false} /> {/* Need adding ripple={boolean} */}
                    </div>
                )}
            </div>
        </div>
    );
}
