import Constants from '../constants.js';
import CurrentPiece from './current_piece.js';
import PlayBlock from './play_block.js';
import PlayerState from '../models/player_state.js';
import React from 'react';

var PlayArea = React.createClass({
  render: function() {
    return (
      <g className="play-field">
        <PlayAreaBackground/>
        <PlayAreaBlocks field={this.props.field} state={this.props.state}/>
        {
          this.props.piece ? 
          <CurrentPiece key={this.props.piece.count} piece={this.props.piece} field={this.props.field}/> : 
          null
        }
        <PlayAreaBorder/>
      </g>
    );
  }
});

var PlayAreaBackground = React.createClass({
  render: function() {
    var playAreaXOffset = Constants.playAreaXOffset;
    var playAreaYOffset = Constants.playAreaYOffset;
    var gridWidth = Constants.gridWidth;
    var gridHeight = Constants.gridHeight;
    var blockWidth = Constants.blockWidth;
    return (
      <g>
        <defs>
          <filter id="sofGlow">
            <feMorphology radius="2" in="SourceAlpha" />
            <feGaussianBlur stdDeviation="8" result="blurred" />
            <feFlood flood-color="rgb(0,0,0)" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
            <feMerge>
              <feMergeNode in="softGlow_colored"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width={blockWidth * 10} height={blockWidth * 20} 
          x={playAreaXOffset} 
          y={playAreaYOffset}
          fill="#272822"
          filter="url(#sofGlow)"
        />
      </g>
    );
  }
});

var PlayAreaBorder = React.createClass({
  render: function() {
    var playAreaXOffset = Constants.playAreaXOffset;
    var playAreaYOffset = Constants.playAreaYOffset;
    var gridWidth = Constants.gridWidth;
    var gridHeight = Constants.gridHeight;
    var blockWidth = Constants.blockWidth;
    return (
      <g>
        <line key='top-border' strokeWidth={1} stroke='#464741'
        x1={playAreaXOffset} y1={playAreaYOffset}
        x2={gridWidth * blockWidth + playAreaXOffset} y2={playAreaYOffset} />

        <line key='left-border' strokeWidth={1} stroke='#464741'
        x1={playAreaXOffset} y1={playAreaYOffset}
        x2={playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
        
        <line key='bottom-border' strokeWidth={1} stroke='#464741'
        x1={playAreaXOffset} y1={gridHeight * blockWidth + playAreaYOffset}
        x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />

        <line key='right-border' strokeWidth={1} stroke='#464741'
        x1={gridWidth * blockWidth + playAreaXOffset} y1={playAreaYOffset}
        x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
      </g>
    );
  }
});

var PlayAreaBlocks = React.createClass({
  render: function() {
    var blocks = this.makeBlocksToRender();
    return <g>{blocks}</g>
  },
  makeBlocksToRender: function() {
    var res = [];
    var field = this.props.field;
    var state = this.props.state;

    for(var row = 0; row < field.height; row++) {
      for(var col = 0; col < field.width; col++) {
        var block = field.blocks[row][col];
        if(block != null) {
          var colorHtmlCode = block.color.toHtmlCode();
          switch (state.id) {
            case PlayerState.normal:
            case PlayerState.end:
              res.push(<PlayBlock key={row + ' ' + col} row={row} col={col} colorHtmlCode={colorHtmlCode}/>);
              break;
            case PlayerState.purge:
              var blinkCount = state.blinkCount;
              var completeRows = state.completeRows;

              // If blink count is {1, 3, 5, ...} or row is not completed
              // show the row. Else hide the row.
              if (blinkCount % 2 != 0 || !completeRows.includes(row))
                res.push(<PlayBlock key={row + ' ' + col} row={row} col={col} colorHtmlCode={colorHtmlCode}/>);
          }
        }
      }
    }
    return res;
  }
});

export default PlayArea;