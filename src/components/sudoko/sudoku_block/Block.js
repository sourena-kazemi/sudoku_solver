import React, { Component } from 'react';
import SudokuBlock from './style';
import Tile from '../sudoku_tile/Tile';
class Block extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        return ( <SudokuBlock>{this.props.tiles.map((tile,index) => <Tile value={tile.value} blockIndex={this.props.blockIndex} tileIndex={index} key={index} getData={this.props.getData}/>)}</SudokuBlock> );
    }
}
export default Block;