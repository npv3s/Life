import React from 'react';
import ReactDOM from 'react-dom';

function new_board(height, width) {
    return Array.from(Array(height), () => new Array(width).fill(0))
}

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

class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const board = this.props.board;
        let rows = [];
        for (let r = 0; r < board.length; r++) {
            let row = [];
            for (let c = 0; c < board[0].length; c++) {
                if (this.props.started)
                    row.push(<Cell row={r} column={c}
                                   key={(r << 16) + (c + 1)}
                                   value={board[r][c]}/>);
                else
                    row.push(<Cell row={r} column={c}
                                   key={(r << 16) + (c + 1)}
                                   value={board[r][c]}
                                   onClick={this.props.onClick}/>);
            }
            rows.push(<div className="row" key={r}>{row}</div>);
        }

        return (
            <div className="board">
                {rows}
            </div>
        )
    }
}

class Control extends React.Component {
    constructor(props) {
        super(props);
        this.height = this.props.height;
        this.width = this.props.width;
        this.resize = this.resize.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.setHeight = this.setHeight.bind(this);
    }

    resize() {
        this.props.resize(this.height, this.width)
    }

    setWidth(e) {
        this.width = parseInt(e.target.value)
    }

    setHeight(e) {
        this.height = parseInt(e.target.value)
    }

    render() {
        return (
            <>
                <div className="field">
                    <div className="label">Размер</div>
                    <div className="field is-grouped sizes">
                        <div className="control">
                            <input id="board-height" className="input" onChange={this.setHeight} type="text"
                                   placeholder="Высота"/>
                        </div>
                        <div className="control">
                            <input id="board-width" className="input" onChange={this.setWidth} type="text"
                                   placeholder="Ширина"/>
                        </div>
                        <div className="control">
                            <button onClick={this.resize} className="button">Применить</button>
                        </div>
                    </div>
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        {(this.props.started) ?
                            <button onClick={this.props.stop} className="button is-danger">Стоп</button> :
                            <button onClick={this.props.start} className="button is-primary">Старт</button>}
                    </div>
                    <div className="control">
                        <button onClick={this.props.reset} className="button is-info">Сброс</button>
                    </div>
                </div>
            </>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.height = this.props.height;
        this.width = this.props.width;
        this.state = {
            started: false,
            board: new_board(this.height, this.width)
        }
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.resize = this.resize.bind(this);
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

    reset() {
        this.stop();
        this.setState({
            board: new_board(this.height, this.width)
        })
    }

    resize(height, width) {
        this.width = (isNaN(width)) ? this.props.width : Math.abs(width);
        this.height = (isNaN(height)) ? this.props.height : Math.abs(height);
        this.reset();
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.started)
                this.update();
        }, 500)
    }


    update() {
        let board = this.state.board;
        let updated = new_board(this.height, this.width);
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
        return (
            <div className="columns">
                <div className="column is-narrow">
                    <Board board={this.state.board} started={this.state.started} onClick={this.onClick}/>
                </div>
                <div className="column">
                    <Control started={this.state.started} stop={this.stop} start={this.start} reset={this.reset}
                             resize={this.resize}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Game height={10} width={10}/>, document.getElementById("game"));