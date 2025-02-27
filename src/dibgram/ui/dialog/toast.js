import React from 'react';
import PropTypes from 'prop-types';
import './toast.scss';
import { createStore } from 'redux';
import { connect } from 'react-redux';

/**
 * Renders a toast (a small text which is temporarily shown in the middle of the screen)
 */
export default function Toast({children}) {
    const [closed, setClosed] = React.useState(false);
    React.useEffect(() => {
        setTimeout(() => { // Automatically close after 6 seconds
            setClosed(true); // When an element has a closing dialog, a CSS class should be added to trigger the animation
            setTimeout(() => { // Then we wait until the animation is finished
                addToast(null); // And we can safely remove the element
            }, 2000);
        }, 6000);
    }, []);
    return (
        <div className={'toast' + (closed? ' closed':'')}>
            <div className="toast-content">
                {children}
            </div>
        </div>
    );
}
Toast.propTypes = {
    children: PropTypes.node.isRequired,
};

export const toastStore= createStore((state=null, action) => {
    if(action.type=='SET_TOAST') return action.toast;
    return state;
});

export const Toasts= connect(state=>({toast: state}))(function Toasts({toast}){
    return toast;
});

export function addToast(toast) {
    toastStore.dispatch({
        type: 'SET_TOAST',
        toast
    });
}
