import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../../../../ui/elements/icon-button';
import { info_back, info_close } from '../../../../ui/icon/icons';
import __, { _s__ } from '../../../../language-pack/language-pack';
import ToolStrip from '../../../../ui/tool-strip/tool-strip';
import { themeStore } from '../../../../ui/themes/theme';
import { getRtlMode } from '../../../../language-pack/language-pack';

export default function SettingsAdvanced({onClose, onBack}) {
    const [enableRtl, setEnableRtl] = React.useState(localStorage.getItem('dibgram-allow-rtl-layout') == 'true');

    return (
        <React.Fragment>
            <div className="header">
                <IconButton className="icon-button back" icon={info_back} onClick={onBack} />
                <h3 className="title">{__('lng_settings_advanced')}</h3>
                <IconButton className="icon-button close" icon={info_close} onClick={onClose}/>
            </div>
            <ToolStrip.Section>
                <ToolStrip.ToggleButton text={_s__('lngd_settings_advanced_rtl')} hideIcon={true} isActive={enableRtl} onChange={() => {
                    setEnableRtl(!enableRtl);
                    localStorage.setItem('dibgram-allow-rtl-layout', !enableRtl);
                    themeStore.dispatch({type: 'SET_RTL', rtl: getRtlMode()});
                }} />
            </ToolStrip.Section>
        </React.Fragment>
    );
}
SettingsAdvanced.propTypes = {
    onClose: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};