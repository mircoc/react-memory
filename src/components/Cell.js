import React, { Component } from 'react';

import Icon from './Icon';

/**
 * Dolphin.js
 * Horse.js
 * Ladybug.js 
 * Mouse.js   
 * Panda.js   
 * Snake.js
 */

const style = {
    cell: {
        backgroundColor: '#444',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '150%',
        padding: '5px',
        //paddingBottom: '30%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

class Cell extends Component {

    constructor(props) {
        super(props)

        this.state = {
            revealed: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onRevealRequest(this.props.id)
    }

    render() {
        return (
            <button style={style.cell} onClick={this.handleClick}>
                <Icon revealed={this.props.isOpened} iconId={this.props.iconId} />
            </button>
        );
    }
}

export default Cell;