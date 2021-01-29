import React from 'react';
import ReactDOM from 'react-dom';

class Cell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let row = this.props.row;
        let column = this.props.column;
        return (
            <div key={String(row) + " " + String(column)}
                 className={"cell" + ((this.props.value === 1) ? " clicked" : "")}
                 onClick={() => this.props.onClick(row, column)}/>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.height = props.height;
        this.width = props.width;
        this.state = {
            started: false,
            board: Array.from(Array(this.height), () => new Array(this.width).fill(0))
        }
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.update = this.update.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    start() {
        this.setState({
            started: true
        })
    }

    stop() {
        this.setState({
            started: false
        })
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.started)
                this.update();
        }, 500)
    }


    update() {
        let board = this.state.board;
        let updated = Array.from(Array(this.height), () => new Array(this.width).fill(0));
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                let sum = 0;
                for (let i = Math.max(r - 1, 0); i < Math.min(r + 2, this.height); i++) {
                    for (let y = Math.max(c - 1, 0); y < Math.min(c + 2, this.width); y++) {
                        if ((i !== r) || (y !== c)) sum += board[i][y]
                    }
                }
                if (sum === 3)
                    updated[r][c] = 1;
                else if (sum === 2)
                    updated[r][c] = board[r][c];
                else
                    updated[r][c] = 0;
            }
        }
        this.setState({
            board: updated
        })
    }

    onClick(row, column) {
        let board = this.state.board;
        board[row][column] = (board[row][column] === 0) ? 1 : 0;
        this.setState({
            board: board
        })
    }

    render() {
        let rows = [];
        for (let r = 0; r < this.props.height; r++) {
            let row = [];
            for (let c = 0; c < this.props.width; c++)
                row.push(<Cell row={r} column={c}
                               value={this.state.board[r][c]}
                               onClick={this.onClick}/>);
            rows.push(<div className="row" key={String(r)}>{row}</div>);
        }

        return (
            <>
                <div className="board">
                    {rows}
                </div>
                {(this.state.started) ? <button onClick={this.stop}>Stop</button> :
                    <button onClick={this.start}>Start</button>}
            </>
        )
    }
}

ReactDOM.render(<Game height={10} width={10}/>, document.querySelector(".game"));