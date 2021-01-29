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
        this.height = 10;
        this.width = 10;
        this.state = {
            started: false,
            board: Array.from(Array(this.height), () => new Array(this.width).fill(0))
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
            board: Array.from(Array(this.height), () => new Array(this.width).fill(0))
        })
    }

    resize() {
        let width = document.getElementById("board-width").value;
        let height = document.getElementById("board-height").value;
        this.width = (width === "") ? 10 : parseInt(width);
        this.height = (height === "") ? 10 : parseInt(height);
        console.log(height, width);
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
        for (let r = 0; r < this.height; r++) {
            let row = [];
            for (let c = 0; c < this.width; c++) {
                if (this.state.started)
                    row.push(<Cell row={r} column={c}
                                   value={this.state.board[r][c]}/>);
                else
                    row.push(<Cell row={r} column={c}
                                   value={this.state.board[r][c]}
                                   onClick={this.onClick}/>);
            }
            rows.push(<div className="row" key={String(r)}>{row}</div>);
        }

        return (
            <div className="columns">
                <div className="column is-narrow">
                    <div className="board">
                        {rows}
                    </div>
                </div>
                <div className="column">
                    <div className="field">
                        <div className="label">Размер</div>
                        <div className="field is-grouped sizes">
                            <div className="control">
                                <input id="board-height" className="input" type="text" placeholder="Высота"/>
                            </div>
                            <div className="control">
                                <input id="board-width" className="input" type="text" placeholder="Ширина"/>
                            </div>
                            <div className="control">
                                <button onClick={this.resize} className="button">Применить</button>
                            </div>
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            {(this.state.started) ?
                                <button onClick={this.stop} className="button is-danger">Стоп</button> :
                                <button onClick={this.start} className="button is-primary">Старт</button>}
                        </div>
                        <div className="control">
                            <button onClick={this.reset} className="button is-info">Сброс</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Game height={10} width={10}/>, document.querySelector(".game"));