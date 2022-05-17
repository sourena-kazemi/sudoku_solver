import React, { Component } from 'react';
import _ from 'lodash';
import Container from './components/sudoko/sudoku_container/Container';
import {SolveButton,GenerateButton,PageOverLay} from './style';
class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      sudokuInfo:{
        width:9,
        height:9,
        blockWidth:3,
        blockHeight:3,
        blocksInWidth:3,
        blocksInHeight:3
      },
      sudokuStructure:[],
      sudokuPossibleAnswers:[1,2,3,4,5,6,7,8,9],
      backTrackedTiles:[],
      backTrackCounter : 0,
      overLayvisibility: "hidden",
    };
  }
  componentDidMount() {
    this.generateSudoku(this.state.sudokuInfo)
  }
  generateSudoku = (info) => {
    let emptyGeneratedSudoku = [];
    //adding 9 blocks to sudoku.
    emptyGeneratedSudoku = this.addElementToSudoku(info.blockWidth,info.blockHeight,emptyGeneratedSudoku,[]);
    //adding 9 tiles to each block.
    emptyGeneratedSudoku.map((block,index) => emptyGeneratedSudoku[index]=this.addElementToSudoku(info.blockWidth,info.blockHeight,[],0));
    this.setState({sudokuStructure:emptyGeneratedSudoku,backTrackCounter:0,backTrackedTiles:[]});
  }
  addElementToSudoku = (width,height,array,value) => {
    for(let i = 1;i<= width;i++){
      for(let j = 1;j <= height;j++){
        array.push({value});
      }
    }
    return array;
  }
  getData = (tile,value) => {
    let temporaryArray = this.state.sudokuStructure;
    temporaryArray[tile.blockIndex][tile.tileIndex].value=Number(value);
    this.setState({sudokuStructure:temporaryArray});
  }
  startApp = () => {
    this.handleAppClicking("fixed");
    this.solveSudoku();
  }
  solveSudoku = () => {
    let sudoku = this.state.sudokuStructure;
    let answers = this.state.sudokuPossibleAnswers;
    this.handleEmptyTiles(sudoku,this.checkTile,answers);
    this.handleEmptyTiles(sudoku,this.backTrackTile,answers);
    this.handleAppClicking("hidden");
  }
  handleEmptyTiles = (sudoku,callback,answers) => {
    sudoku.map((block,blockIndex)=>{
      block.map((tile,tileIndex) => {
        if(!tile.value){
          callback(sudoku,answers,blockIndex,tileIndex);
        }
      })
    })
  }
  checkTile = (sudoku,answers,block,tile) => {
    const notAnswers = new Set();
    let sudokuStructure = sudoku;
    let possibileAnswers = answers;
    let currentBlock = sudoku[block];
    //check for block possibilities
    let filledTilesOfBlock = currentBlock.filter(tile => tile.value !== 0);
    filledTilesOfBlock.map(tile=>notAnswers.add(tile.value));

    let blocksInWidth = this.state.sudokuInfo.blocksInWidth;
    let verticalDistance = blocksInWidth*(this.state.sudokuInfo.blocksInHeight-1); //this is distance between first and last element of one vertical line.
    //this was like blocksInWidth*(blocksInHeight-2)+blocksInWidth and then blocksInWidth*(blocksInHeight-2+1)
    let horizontalDistance = blocksInWidth-1; //this is distance between first and last element of one horizental line. 
    let inVerticalLineBlocks = this.FindInLineElements(block,-verticalDistance,verticalDistance,blocksInWidth);
    //in line above we are starting from block index and checking for blocks in distance of -6,-3,0,+3 and +6.
    let inHorizontalLineBlocks = this.FindInLineElements(block-inVerticalLineBlocks[0],0,horizontalDistance,1);
    //in line above first we calculate position of first block on that horizontal line and then we check for blocks in distance of 0,+1 and +2

    //check for vertical possibilities
    let inVerticalLineTiles = this.FindInLineElements(tile,-verticalDistance,verticalDistance,blocksInWidth);
    this.checkInLineTiles(inVerticalLineBlocks,inVerticalLineTiles).map(value => notAnswers.add(value));

    //check for horizontal possibilities
    let inHorizontalLineTiles = this.FindInLineElements(tile-inVerticalLineTiles[0],0,horizontalDistance,1);
    this.checkInLineTiles(inHorizontalLineBlocks,inHorizontalLineTiles).map(value => notAnswers.add(value));
    //checking for definitive answer
    if(notAnswers.size === possibileAnswers.length-1){
      possibileAnswers.map(answer => {
        if(!notAnswers.has(answer)){
          sudokuStructure[block][tile].value = answer;
        }
      })
    }else{
      let answers = _.difference(possibileAnswers,[...notAnswers]);
      this.saveTileInfo(sudoku,block,tile,answers,[inVerticalLineBlocks,inVerticalLineTiles],[inHorizontalLineBlocks,inHorizontalLineTiles])
    }
    this.setState({sudokuStructure})
  }
  FindInLineElements = (element,min,max,step) => {
    //this function will find blocks / tiles that are in the same vertical / horizontal line with given block / tile.
    let inLineElementsIndex = [];
    for(let i = min;i<=max;i+=step){
      let result = element + i;
      if(result>=0 && result<=8){
        inLineElementsIndex.push(result);
      }
    }
    return inLineElementsIndex;
  }
  checkInLineTiles = (blocks,tiles) => {
    //this function will find all tiles that are in the same vertical / horizontal line with given tile.
    let inLineTilesValue = [];
    blocks.map(block => tiles.map(position => {
      let value=this.state.sudokuStructure[block][position].value;
      if(value){inLineTilesValue.push(value)}
    }))
    return inLineTilesValue;
  }
  saveTileInfo = (sudoku,blockIndex,tileIndex,answers,verticalInfo,horizontalInfo) => {
    let sudokuStructure = sudoku;
    let tile = sudokuStructure[blockIndex][tileIndex]
    tile["answers"] = answers;
    tile["info"] = {verticalInfo,horizontalInfo}
    this.setState({sudokuStructure})
  }
  backTrackTile = (sudoku,answers,blockIndex,tileIndex) => {
    //this function will check all possibile answers for each tile wih backtrack algorithm.
    let sudokuStructure = sudoku;
    let backTrackedTiles = this.state.backTrackedTiles;
    let backTrackCounter = this.state.backTrackCounter;
    let tile = sudokuStructure[blockIndex][tileIndex];
    let values = tile["answers"];
    let valueIndex = 0;
    let value = values[valueIndex];
    let shouldCheckTile = backTrackCounter;
    const updateValues = () => {
      value = values[valueIndex];
      shouldCheckTile = backTrackCounter;
    }
    const updateState = () => {
      this.setState({sudokuStructure,backTrackedTiles,backTrackCounter});
    }
    const changeTile = () => {
      updateValues();
      tile.value = value;
      backTrackedTiles.push({blockIndex,tileIndex,value,valueIndex});
      tile["backTrackIndex"] = backTrackCounter;
      backTrackCounter++;
      console.log(shouldCheckTile)
      updateState();
    }
      while(!this.isValueValid(sudoku,blockIndex,tileIndex,value)){
        if(valueIndex!==values.length-1){
          valueIndex++;
          updateValues();
        }else if(shouldCheckTile){
            let tileInfo = backTrackedTiles[shouldCheckTile]
            let currentTile = sudoku[tileInfo.blockIndex][tileInfo.tileIndex]
            let tileAnswers = currentTile["answers"];
            if(tileInfo.valueIndex !== tileAnswers.length - 1){
              for(let i = shouldCheckTile;shouldCheckTile<=backTrackedTiles.length-1;i++){
                let tile = backTrackedTiles[i];
                sudoku[tile.blockIndex][tile.tileIndex].value=0;
              }
              for(let i = shouldCheckTile;shouldCheckTile<=backTrackedTiles.length-1;i++){
                let tile = backTrackedTiles[i];
                for(let j = tileInfo.valueIndex+1;j<=tileAnswers.length-1;j++){
                  if(this.isValueValid(sudoku,tileInfo.blockIndex,tileInfo.tileIndex,tileAnswers[i])){
                    currentTile.value=tileAnswers[i];
                    tileInfo.valueIndex=i;
                    updateState();
                  }else if(i===tileAnswers.length-1){
                    shouldCheckTile--;
                    console.log("a",tileInfo,tileAnswers);
                    break;
                  }
                }
              }
        }else{
          shouldCheckTile--;
        }
        updateState();
      }else{
        // console.log(shouldCheckTile,backTrackCounter,tile);
        break;
      }
    }
    if(this.isValueValid(sudoku,blockIndex,tileIndex,value)){
      changeTile();
    }
  }
  isValueValid = (sudoku,blockIndex,tileIndex,value) => {
    let tile = sudoku[blockIndex][tileIndex];
    let verticalInfo = tile["info"].verticalInfo;
    let horizontalInfo = tile["info"].horizontalInfo;
    let isValid = true;
    const makeValueFalse = () => {isValid = false}
    //checking block
    sudoku[blockIndex].map(tile => {if(tile.value === value){makeValueFalse()}})
    //checking vertical / horizontal line
    this.checkInLineTiles(verticalInfo[0],verticalInfo[1]).map(number => {if(number===value){makeValueFalse()}});
    this.checkInLineTiles(horizontalInfo[0],horizontalInfo[1]).map(number => {if(number===value){makeValueFalse()}});
    return isValid;
  } 
  handleAppClicking = (mode) => { 
    this.setState({overLayvisibility:mode});
  }
  render() { 
    return (
      <>
        <Container sudokuStructure={this.state.sudokuStructure} getData={this.getData}/>
        <SolveButton onClick={this.startApp}>Solve</SolveButton>
        <GenerateButton onClick={()=>{this.generateSudoku(this.state.sudokuInfo)}}>Generate</GenerateButton>
        <PageOverLay visibility={this.state.overLayvisibility}/>  
      </>   
    );
  }
}

export default App;