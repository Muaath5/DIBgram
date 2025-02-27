import React from 'react';
import classic from './classic.json';
import day from './day.json';
import tinted from './tinted.json';
import night from './night.json';
import { convertThemeToCSS } from './dibgram-theme-to-css';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { getRtlMode } from '../../language-pack/language-pack';

const themes = { day, classic, tinted, night };

function getThemeFromStorage() {
    let theme = localStorage.getItem('dibgram-theme');
    if (!theme) { // if theme is not set in localStorage, use OS theme
        theme= window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        localStorage.setItem('dibgram-theme', theme);
    }
    return theme;
}

export const themeStore = createStore(
    (state = { 
        theme: getThemeFromStorage(),
        rtl: getRtlMode()
    }, action) => {
        switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.theme };
        case 'SET_RTL':
            return { ...state, rtl: action.rtl };
        default:
            return state;
        }
    }
);

/**
 * All children of this component will be rendered with the theme. Can be treated as a div.
 */
export const ThemeProvider= connect(state=> state) (
    // eslint-disable-next-line no-unused-vars
    function ThemeProvider({ theme, rtl, dispatch, ...rest}) {
        return (
            <div dir={rtl ? 'rtl' : 'ltr'}
                data-theme-is-dark={themes[theme].isDark.value}
                {...rest} 
                style={convertThemeToCSS({...classic, ...themes[theme]})}
            />
        );
    });

export function setTheme(theme) {
    localStorage.setItem('dibgram-theme', theme);
    themeStore.dispatch({ type: 'SET_THEME', theme });
}
