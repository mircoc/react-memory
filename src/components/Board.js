import React, { Component } from 'react';

import Cell from './Cell';
import { ICONS_IDS } from './Icon';

const style = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 18vmin)',
        gridTemplateRows: 'repeat(4, 18vmin)',
        gridGap: '0.5em',
        backgroundColor: '#fff',
        color: '#444',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignContent: 'center',
    },
    container: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        backgroundColor: '#ccc',
        gridColumnEnd: 'span 3',
    }
};

class Board extends Component {

    constructor(props) {
        super(props);

        const size = this.props.size;
        if (size % 2 !== 0) {
            throw new Error("size must be even!");
        }

        let iconsId = ICONS_IDS.slice();
        let iconPosition = [];
        for (let i=0; i<size; i=i+2) {
            const icon = iconsId.pop();
            // if icons bucket is empty refill it
            if (icon === undefined) {
                iconsId = ICONS_IDS.slice();
            }
            // place the same icon in two position
            iconPosition[i] = icon;
            iconPosition[i+1] = icon;
        }
        const randomizedIconPosition = iconPosition.sort(() => Math.random() - 0.5);
        this.state = {
            finished: false,
            cellIdToIconId: randomizedIconPosition,
            cellIdOpened: [...Array(size)].fill(false),
            waitingToCloseBadCouple: false,
            moves: 0,
            width: 0,
            height: 0,
            coupleOpened: [],
        };
        console.log("Board initial state: ", this.state);

        this.onCellRevealRequest = this.onCellRevealRequest.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getMaxSquareSize = this.getMaxSquareSize.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    onCellRevealRequest(cellId) {
        if (this.state.finished) {
            // game already finished no more moves allowed
            return;
        }
        if (this.state.waitingToCloseBadCouple) {
            // waiting to close bad cards couple opened
            return;
        }
        
        // save the number of moves
        this.setState((prevState, props) => {
            return { moves: prevState.moves + 1 };
        });

        const iconId = this.state.cellIdToIconId[cellId];
        const numOpened = this.state.cellIdOpened.filter((val) => val).length;
        const roundOpened = numOpened % 2 === 1;
        let matchingFound = false;
        if (roundOpened) {
            let matchingCellIdWithIconId = this.state.cellIdToIconId.indexOf(iconId);
            // if i found the current cell, continue to search
            if (matchingCellIdWithIconId === cellId) {
                matchingCellIdWithIconId = this.state.cellIdToIconId.indexOf(iconId, matchingCellIdWithIconId+1);
            }
            console.log("matching cellId: " + matchingCellIdWithIconId +
            '[' + (this.state.cellIdOpened[matchingCellIdWithIconId] ? 'OPENED' : 'CLOSED') +
            '] current cellId: '+ cellId +
            '[' + (this.state.cellIdOpened[matchingCellIdWithIconId] ? 'OPENED' : 'CLOSED') + ']');

            // check if corresponding is opened
            matchingFound = this.state.cellIdOpened[matchingCellIdWithIconId];
            console.log("matching found: "+ (matchingFound ? 'YES' : 'NO'));

            if (this.state.cellIdOpened[cellId]) {
                // clicked on a already opened cellId
                console.log("Clicked on a cell already opened: " + cellId);

                // if (!matchingFound) {
                //     // close the card 
                //     this.setState((prevState, props) => {
                //         let cellIdOpened = prevState.cellIdOpened.slice();
                //         cellIdOpened[cellId] = false;
                //         return { cellIdOpened };
                //     });
                // }
                return;
            }

            

            if (matchingFound) {
                // open the card 
                this.setState((prevState, props) => {
                    let cellIdOpened = prevState.cellIdOpened.slice();
                    cellIdOpened[cellId] = true;
                    return { cellIdOpened };
                });

                // check if all card is opened
                if ((numOpened + 1) === this.props.size) {
                    this.setState({
                        finished: true
                    });
                }
            } else {
                // no matching found ...

                // open the card clicked
                this.setState((prevState, props) => {
                    let cellIdOpened = prevState.cellIdOpened.slice();
                    let coupleOpened = prevState.coupleOpened.slice();
                    cellIdOpened[cellId] = true;
                    coupleOpened[1] = cellId;
                    
                    return { cellIdOpened, coupleOpened, waitingToCloseBadCouple: true };
                });

                // close the bad couple after five seconds
                setTimeout(() => {
                    this.setState((prevState, props) => {
                        let cellIdOpened = prevState.cellIdOpened.slice();
                        let coupleOpened = prevState.coupleOpened.slice();
                    
                        cellIdOpened[coupleOpened[0]] = false;
                        cellIdOpened[coupleOpened[1]] = false;
                        
                        return { cellIdOpened, coupleOpened: [], waitingToCloseBadCouple: false };
                    });
                }, 5000);
            }
            
        } else {
            // round not open so i leave the first card opened
            this.setState((prevState, props) => {
                let cellIdOpened = prevState.cellIdOpened.slice();
                cellIdOpened[cellId] = true;
                return { cellIdOpened, coupleOpened: [cellId] };
            });
        }
        
    }

    getMaxSquareSize(x, y, n) {
        // https://math.stackexchange.com/a/466248
        // 
        // double x=500, y=600, n=12;//values here
        // double px=ceil(sqrt(n*x/y));
        // double sx,sy;
        // if(floor(px*y/x)*px<n)	//does not fit, y/(x/px)=px*y/x
        //     sx=y/ceil(px*y/x);
        // else
        //     sx= x/px;
        // double py=ceil(sqrt(n*y/x));
        // if(floor(py*x/y)*py<n)	//does not fit
        //     sy=x/ceil(x*py/y);
        // else
        //     sy=y/py;
        // printf("%f",MAX(sx,sy));

        const px = Math.ceil(Math.sqrt(n*x/y));
        let sx, sy;
        if ((Math.floor(px*y/x)*px) < n) {
            sx = y / Math.ceil(px*y/x);
        } else {
            sx = x / px;
        }
        const py = Math.ceil(Math.sqrt(n*y/x));
        if ((Math.floor(py*x/y)*py) < n) {
            sy = x / Math.ceil(x*py/y);
        } else {
            sy = y / py;
        }

        return Math.max(sx, sy);
    }

    render() {
        const size = this.props.size;
        const maxSquareSize = this.getMaxSquareSize(this.state.width, this.state.height, size);
        const cols = Math.floor(this.state.width / maxSquareSize);
        const rows = Math.floor(this.state.height / maxSquareSize);
        const perc = (100/Math.max(rows, cols)).toFixed();

        const gridStyleDynamic = {
            gridTemplateColumns: 'repeat(' + cols + ', ' + perc + 'vmin)',
            gridTemplateRows: 'repeat(' + rows + ', ' + perc + 'vmin)'
            //gridTemplateColumns: 'repeat(12 1fr)',
            //gridTemplateRows: 'repeat(1 1fr)'
        };
        const topbarStyleDynamic = {
            gridColumnEnd: 'span '+cols
        };
        return (
            <div style={style.container}>
                <div style={Object.assign({}, style.grid, gridStyleDynamic)}>
                    <div style={Object.assign({}, style.topbar, topbarStyleDynamic)}>
                        {this.state.finished ?
                        <div>
                        <b>You Won!</b> with {this.state.moves} moves
                        </div>
                        :
                        <div>
                        Moves: {this.state.moves}
                        </div>
                        }
                    </div>
                    {[...Array(size)].map((_, i) => {
                        return <Cell key={i} id={i} 
                        iconId={this.state.cellIdToIconId[i]} 
                        onRevealRequest={this.onCellRevealRequest}
                        isOpened={this.state.cellIdOpened[i]}
                        />
                    })}
                </div>
            </div>
        );
    }
}

export default Board;