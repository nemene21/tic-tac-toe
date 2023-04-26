
// "https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript"
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// "http://www.java2s.com/ref/javascript/javascript-string-copy.html"
String.prototype.copy = function() {
    return this.substring(0, this.length);
}

const AIbutton = document.getElementById("AIswapper");

let use_ai = true
function swapAI() {
    use_ai = !use_ai;
    AIbutton.textContent = "AI: " + ["✔", "✖"][Number(!use_ai)];
}

class Board {
    constructor(data = "         ") {
        this.data  = data;
        this.xTurn = true;
    }

    AIplay() {
        if (!this.data.includes(" ") || !use_ai) return;

        let best_move;
        let best_score = 0;

        let moves = this.getLegalMoves(this.data);
        for (let i = 0; i < moves.length; i++) {
            let new_score = this.minimax(true, moves[i], this.data.copy())

            if (new_score >= best_score) {
                best_score = new_score;
                best_move = moves[i];
            }
        }
        this.play(best_move, true);
    }

    minimax(minimising, move, board_data) {
        let el    = ["X", "O"][Number(!minimising)];
        let enemy = ["X", "O"][Number(minimising)];

        board_data = board_data.replaceAt(move, el);

        let score = Number(this.checkElWin(el, board_data)) - Number(this.checkElWin(enemy, board_data));

        let moves = this.getLegalMoves(board_data);
        if (moves.length != 0 && score == 0) {
            let best_score = 0;
            let best_move;

            for (let i = 0; i < moves.length; i++) {

                let new_score = this.minimax(!minimising, moves[i], board_data);

                if (minimising && new_score <= best_score) {
                    best_score = new_score;
                    best_move  = moves[i];

                } else if (!minimising && new_score >= best_score) {
                    best_score = new_score;
                    best_move  = moves[i];
                }
            }

            return best_score;

        } else {
            return score;
        }
    }

    getLegalMoves(board_data) {
        let moves = [];
        for (let i = 0; i <= 8; i++) {
            if (board_data[i] == " ") {
                moves.push(i);
            }
        }

        return moves;
    }

    play(index, aiPlayed=false) {

        if (this.data[index] != " ") return -1;

        if (this.xTurn) {
            this.data = this.data.replaceAt(index, "X");

        } else {
            this.data = this.data.replaceAt(index, "O");
        }

        this.xTurn = !this.xTurn;
        this.display();

        let winner = this.getWinner();
        if (winner != "-") {
            setTimeout(function() {
                alert(winner + " won! (he's better at the game)");
                restart();
                return 1;
            }, 150);
        } else if (!aiPlayed) {
            this.AIplay();
        }
    }

    checkElWin(el, board_data) {
        return (
            (board_data[0] == board_data[1] && board_data[0] == board_data[2] && board_data[0] == el) ||
            (board_data[3] == board_data[4] && board_data[3] == board_data[5] && board_data[3] == el) ||
            (board_data[6] == board_data[7] && board_data[6] == board_data[8] && board_data[6] == el) ||
            (board_data[0] == board_data[3] && board_data[0] == board_data[6] && board_data[0] == el) ||
            (board_data[1] == board_data[4] && board_data[1] == board_data[7] && board_data[1] == el) ||
            (board_data[2] == board_data[5] && board_data[2] == board_data[8] && board_data[2] == el) ||
            (board_data[0] == board_data[4] && board_data[0] == board_data[8] && board_data[0] == el) ||
            (board_data[2] == board_data[4] && board_data[2] == board_data[6] && board_data[2] == el)
        );
    }

    getWinner() {
        if (this.checkElWin("X", this.data)) return "X";
        if (this.checkElWin("O", this.data)) return "O";

        return "-";
    }

    display() {
        for (let i = 0; i <= 8; i++) {
            document.getElementById("space-" + String(i)).textContent = this.data[i];
        }
    }
}

let board;

function restart() {
    board = new Board();
    board.display();
}

restart();