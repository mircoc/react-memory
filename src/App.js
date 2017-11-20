import React, { Component } from 'react';

import Board from './components/Board';

class App extends Component {
  render() {
    return (
      <div>
        <Board size={12} />
      </div>
    );
  }
}

export default App;
