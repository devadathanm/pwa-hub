const chess = new Chess();
const boardElement = document.getElementById('board');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const diffLevel = document.getElementById('diff-level');

let selectedSquare = null;
let lastMove = { from: null, to: null };
let playerScore = 0;
let aiScore = 0;

function getPieceSymbol(type, color) {
    const symbols = { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' };
    return color === 'w' ? symbols[type].toUpperCase() : symbols[type].toLowerCase();
}

function makeComputerMove() {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;
    
    let move = moves[Math.floor(Math.random() * moves.length)];
    if (diffLevel.value == "2") {
        const captures = moves.filter(m => m.flags.includes('c'));
        if (captures.length > 0) move = captures[0];
    }

    lastMove = { from: move.from, to: move.to };
    chess.move(move);
    renderBoard();
}

function onSquareTouch(squareElement) {
    const square = squareElement.dataset.square;
    if (!selectedSquare) {
        const piece = chess.get(square);
        if (piece && piece.color === 'w') {
            selectedSquare = square;
            renderBoard();
        }
    } else {
        const move = chess.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
            if (move.flags.includes('c')) {
                aiScore += (move.captured === 'p'?1:move.captured==='n'||move.captured==='b'?3:move.captured==='r'?5:9);
                aiScoreEl.textContent = aiScore;
            }
            lastMove = { from: move.from, to: move.to };
            renderBoard();
            setTimeout(makeComputerMove, 500);
        }
        selectedSquare = null;
        renderBoard();
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    const board = chess.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const squareName = String.fromCharCode(97 + j) + (8 - i);
            const squareEl = document.createElement('div');
            squareEl.dataset.square = squareName;
            let classNames = `square ${(i + j) % 2 === 0 ? 'white' : 'black'}`;
            if (squareName === selectedSquare) classNames += ' selected';
            if (squareName === lastMove.from || squareName === lastMove.to) classNames += ' last-move';
            squareEl.className = classNames;
            
            const piece = board[i][j];
            if (piece) {
                const span = document.createElement('span');
                span.className = 'piece';
                span.textContent = getPieceSymbol(piece.type, piece.color);
                squareEl.appendChild(span);
            }
            squareEl.addEventListener('touchstart', (e) => { e.preventDefault(); onSquareTouch(squareEl); });
            boardElement.appendChild(squareEl);
        }
    }
}

renderBoard();