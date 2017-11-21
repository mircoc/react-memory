import React, { Component } from 'react';

import Dolphin from '../images/Dolphin';
import Horse from '../images/Horse';
import Ladybug from '../images/Ladybug';
import Mouse from '../images/Mouse';
import Panda from '../images/Panda';
import Snake from '../images/Snake';
import Question from '../images/Question';

const icons = [
    Dolphin,
    Horse,
    Ladybug,
    Mouse,
    Panda,
    Snake
];

export const ICONS_IDS = [0, 1, 2, 3, 4, 5];

const style = {
    icon: {       
    }
};

class Icon extends Component {

    render() {
        if (!this.props.revealed) {
            return (
                <Question width={'100%'} height={'100%'}/>
            );
        }

        const id = this.props.iconId || 0;
        const IconImage = icons[ id ];
        return (
            <IconImage width={'100%'} height={'100%'}/>
        );
    }
}

export default Icon;