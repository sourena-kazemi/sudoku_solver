import React, { Component } from 'react';
import SudokuTile from './style';
class Tile extends Component {
    constructor(props) {
        super(props);
        this.state={};
    }
    getValue = (e) => {
        let value = e.target.value;
        if(value <= 9){
            this.sendData(this.props,value)
        }
    }
    sendData = (info,value) => {this.props.getData(info,value)}
    render() { 
        return ( 
            <SudokuTile type="number" min="0" max="9" onChange={this.getValue} value={this.props.value === 0 ? "" : this.props.value}/>
        );
    }
}

export default Tile;