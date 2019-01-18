import React from 'react';
import './WordBox.css';

const WordList = props => {
  // TODO: Destructure WordBox props
  const { wordList } = props;
  const words = wordList;

  const wordsList = words.map(function(word, index) {
    return <li key={index}>{word}</li>;
  });

  return (
    <div className="word-box">
    <div>
      <div className="word-list">
        <div className="words">
          <h2>WORDS</h2>
          {/* TODO: Render WordList array */}
          {wordsList}
        </div>
        
      </div>
      </div>
      
    </div>
  );

};

export default WordList;
