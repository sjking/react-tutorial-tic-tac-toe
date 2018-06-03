import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//
//     render() {
//         return (
//             <button className="square" onClick={() => this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// Alternative (better) syntax: "Functional components"
// Functional components only consist of a render method:
// a function that takes props and returns what should be rendered.
function Square(props) {
    const classes = ["square", props.selected ? "selected" : "", props.winner ? " winner" : ""].join(" ");
    return (
        // note that passing down the function `props.onClick` in the onClick handler
        // is sufficent using Functional components
        <button className={classes} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, j, winner) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                selected={i === j}
                key={i}
                winner={winner.wins && winner.squares.includes(i)}
            />
        );
    }

    render() {
        const m = this.props.location.row * 3 + this.props.location.col;
        const xs = [0, 1, 2];
        const winner = this.props.winner.wins ?
            {wins: true, squares: this.props.winner.squares} :
            {wins: false, squares: [9,9,9]};

        return xs.map (row => {
            return (
                <div className="board-row" key={row}>
                    {xs.map(col => this.renderSquare(row * 3 + col, m, winner))}
                </div>
            );
        });
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                loc: {col: 42, row: 42}
            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const currentSquares = current.squares.slice();
        // If the game is already won or the square already taken escape hatch
        if (calculateWinner(currentSquares).wins || currentSquares[i]) {
            return;
        }
        currentSquares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: currentSquares,
                loc: {
                    col: i % 3,
                    row: Math.floor(i / 3),
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        const reverse =
            <button onClick={() => this.setState({ascending: !this.state.ascending})}>
                reverse
            </button>

        let status;
        if (winner.wins) {
            status = 'Winner: ' + winner.wins;
            console.log("winning squares: " + winner.squares);
        }
        else if (history.length >= 9) {
            status = 'Game is a draw'
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        location={current.loc}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{reverse}</div>
                    <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// Helper functions

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {wins: squares[a], squares: lines[i]};
        }
    }
    return {wins: null, squares: null};
}




