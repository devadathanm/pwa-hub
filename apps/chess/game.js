const chess = new Chess();
const boardElement = document.getElementById('board');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const diffLevel = document.getElementById('diff-level');

let selectedSquare = null;
let lastMove = { from: null, to: null };
let playerScore = 0;
let aiScore = 0;

// FIX 1: Use the "filled" Unicode symbols so CSS can color them properly
function getPieceSymbol(type, color) {
    const symbols = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
    return symbols[type];
}

function makeComputerMove() {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;
    
    let move = moves[Math.floor(Math.random() * moves.length)];
    if (diffLevel.value == "2") {
        const captures = moves.filter(m => m.flags.includes('c'));
        if (captures.length > 0) move = captures[0];
    }

    // FIX 2: Give the AI points when it captures your piece
    if (move.flags.includes('c')) {
        aiScore += (move.captured === 'p'?1:move.captured==='n'||move.captured==='b'?3:move.captured==='r'?5:9);
        aiScoreEl.textContent = aiScore;
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
            // FIX 3: Give YOU points when you capture an AI piece (changed from aiScore to playerScore)
            if (move.flags.includes('c')) {
                playerScore += (move.captured === 'p'?1:move.captured==='n'||move.captured==='b'?3:move.captured==='r'?5:9);
                playerScoreEl.textContent = playerScore;
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
                // FIX 4: Add the specific 'piece-w' or 'piece-b' class based on the piece color
                span.className = `piece ${piece.color === 'w' ? 'piece-w' : 'piece-b'}`;
                span.textContent = getPieceSymbol(piece.type, piece.color);
                squareEl.appendChild(span);
            }
            
            // Added both touchstart (for mobile) and mousedown (for testing on your laptop)
            squareEl.addEventListener('touchstart', (e) => { e.preventDefault(); onSquareTouch(squareEl); });
            squareEl.addEventListener('mousedown', (e) => { e.preventDefault(); onSquareTouch(squareEl); });
            
            boardElement.appendChild(squareEl);
        }
    }
}

renderBoard();