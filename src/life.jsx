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
                 onClick={() => this.props.onUpdate(row, column)}/>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: Array.from(Array(props.height), () => new Array(props.width).fill(0))
        }
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(row, column) {
        console.log(row, column);
        let board = this.state.board;
        board[row][column] = (board[row][column] === 0) ? 1 : 0;
        this.setState({
            board: board
        })
    }

    render() {
        let rows = [];
        for (let row_index = 0; row_index < this.props.height; row_index++) {
            let row = [];
            for (let column_index = 0; column_index < this.props.width; column_index++)
                row.push(<Cell row={row_index} column={column_index}
                               value={this.state.board[row_index][column_index]}
                               onUpdate={this.onUpdate}/>);
            rows.push(<div className="row" key={String(row_index)}>{row}</div>);
        }

        return (
            <div className="board">
                {rows}
            </div>
        )
    }
}

ReactDOM.render(<Game height = {10} width = {10}/>, document.querySelector(".game"));