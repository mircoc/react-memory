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

const style = {
    icon: {       
    }
};

class Cell extends Component {

    render() {
        if (!this.props.revealed) {
            return (
                <Question width={'100%'} height={'100%'}/>
            );
        }

        const id = this.props.iconId || 0;
        const Icon = icons[ id ];
        return (
            <Icon width={'100%'} height={'100%'}/>
        );
    }
}

export default Cell;