import React, { Component } from 'react';
import {
  shuffleBoard,
  copyBoard,
  isTileEqual,
  isAdjacent
} from '../../util/gameUtil';
import Board from '../Board';
import WordList from '../WordList/index';
import CurrentWord from '../CurrentWord';
import Button from '../Button';
import './Game.css';
import axios from "axios"

export default class Game extends Component {
  constructor(props) {
    super(props);
    // TODO: Init board with random tiles
    this.initBoard = shuffleBoard();
    // TODO: Init state with the board
    this.state = {
      board: this.initBoard,
      currentWord: '',
      currentWordPosition: [],
      WordList: [],
      checking:false
    };
  }

  // 1. click on the tile
  // 2. update tile selected to true.
  // 2.1 Can select and unselect the tile
  // 2.2 Can only unselect the last tile
  // 2.3 Update currentWord as we select and unselect
  // 2.4. Can only select the surrounding cells
  // 2.5 Make a copy of board, word, currentWordPositions, etc
  // 2.6 Mutate the state
  // 3. render the board with updated tile so it renders as active
  handleClick(rowId, columnId) {
    // TODO: Handle tile click to select / unselect tile.
    const selectedTile = this.state.board[rowId][columnId];
    const lastSelectedTile = this.state.currentWordPosition[
      this.state.currentWordPosition.length - 1
    ];
    if (selectedTile.selected) {
      // Check if selectedTile is last tile
      if (isTileEqual(selectedTile, lastSelectedTile)) {
        // Unselected selectedTile and remove from currentWordPosition
        // Also update the board to set the tile to unselected
        const newBoard = copyBoard(this.state.board);
        newBoard[rowId][columnId].selected = false;
        this.setState({
          currentWord: this.state.currentWord.slice(0, -1),
          board: newBoard,
          currentWordPosition: this.state.currentWordPosition.slice(0, -1)
        });
      }
    } else {
      if (!lastSelectedTile || isAdjacent(selectedTile, lastSelectedTile)) {
        // Select the tile
        const newBoard = copyBoard(this.state.board);
        newBoard[rowId][columnId].selected = true;
        this.setState({
          // update current word with selected tile
          currentWord: this.state.currentWord.concat(
            newBoard[rowId][columnId].letter
          ),
          // update board
          board: newBoard,
          // update current word position with selected tile position
          currentWordPosition: this.state.currentWordPosition.concat({
            rowId: rowId,
            columnId: columnId
          })
        });
      }
    }
  }

  // Adds Current Word to the Word List

  

  handleSubmit(word) {
    // TODO: Check if Current Word is valid

    // Check if word is valid
    if (word.length < 3 || this.state.WordList[word]) {
      return;
    }

    this.setState({
      checking:true
    })
    

    axios.post('https://us-central1-hazel-analytics.cloudfunctions.net/boggle-dictionary', {
      "word":word
    }).then((res)=>{
      this.setState({
        checking:false
      })
      console.log(res.data.valid)
      if(res.data.valid){


        
        // TODO: Unselect all tiles.
        
        const clearedBoard = this.initBoard;
        // TODO: Add to the Word List
        this.setState({
          
          WordList: [ ...this.state.WordList, word],
          currentWord: '',
          currentWordPosition: [],
          board: clearedBoard
        });
      }
      const clearedBoard = this.initBoard;
      this.setState({
        currentWord: '',
        currentWordPosition: [],
        board: clearedBoard
      });
    })

    
  }

  render() {
    const checking = this.state.checking ? <h4 className="checking">Checking...</h4> : null;
    return (
      <div>
        <div className="game-area">
          <Board
            // TODO: Pass Board Props
            board={this.state.board}
            handleClick={this.handleClick.bind(this)}
          />
          <CurrentWord
            // TODO: Pass CurrentWord props
            currentWord={this.state.currentWord}
            label="Current Word"
          />
          <Button
            // TODO: Pass Button Props and Button Callback
            handleSubmit={this.handleSubmit.bind(this, this.state.currentWord)}
            label="SUBMIT WORD"
          />

          {checking}
          
        </div>

        <WordList
          // TODO: Pass WordBox Props
          wordList={this.state.WordList}
          
        />
        
        {/* Makes Board and WordBox be side by side */}
        <div className="clear" />

      </div>
    );
  }
}
