import React, { Component } from 'react';
import Block from '../sudoku_block/Block';
import SudokuContainer from './style';
class Container extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        return ( 
            <SudokuContainer>
                {this.props.sudokuStructure.map((block,index) => <Block blockIndex={index} key={index} tiles={this.props.sudokuStructure[index]} getData={this.props.getData}/>)}
            </SudokuContainer>
        );
    }
}
export default Container;