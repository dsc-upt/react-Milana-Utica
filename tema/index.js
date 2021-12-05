import './index.css';

function Square(props) {

    let squareStatus = null

    if (props.isWinnerSquare) {
        squareStatus = 'winner'
    } else {
        squareStatus = 'square'
    }

    return (
        <button
            className={squareStatus}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        let isWinnerSquare = false

        if (this.props.winnerSquares && this.props.winnerSquares.includes(i)) {
            isWinnerSquare = true;
        }
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isWinnerSquare={isWinnerSquare}
        />
    }

    render() {
        const matrix = [];
        for (let i = 0; i < 9; i = i + 3) {
            matrix.push(<div className="board-row">
                {this.renderSquare(i)}
                {this.renderSquare(1 + i)}
                {this.renderSquare(2 + i)}
            </div>);
        }
        return (
            <div>
                {matrix}
            </div>
        );
    }

}
class Game extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }],
            stepNumber: 0,
            xIsNext: true,
            reverse: false,
        }

        this.reverse = this.reverse.bind(this);
    }

    handleClick(i) {
        const locations = [
            [1, 1],
            [2, 1],
            [3, 1],
            [1, 2],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3],
            [3, 3]
        ];

        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares, false) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                locations: locations[i]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    reverse() {
        this.setState({
            reverse: !this.state.reverse,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares, false)
        const winnerSquares = calculateWinner(current.squares, true)
        const reverse = this.state.reverse;

        const steps = reverse ? history.slice().reverse() : history
        const moves = steps.map((step, index, array) => {
            const move = this.state.reverse ? (array.length - index - 1) : index;
            let desc = move ? 'Go to move ' + move + ' ' + history[move].locations : 'Go to game start'
            if (move === this.state.stepNumber) {
                desc = <b>{desc}</b>
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        const noFreeSquares = current.squares.every((val) => (val != null))
        let status
        if (winner) {
            status = 'Winner: ' + winner
        } else if (noFreeSquares) {
            status = 'It is a draw!'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerSquares={winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={this.reverse}>
                            Reverse moves
                        </button>
                    </div>
                    <ol>{moves}</ol>
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


function calculateWinner(squares, winners) {
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
            if (winners) {
                return [a, b, c]
            }
            return squares[a];
        }
    }
    return null;
}