class Connect4 {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 'red'; // 'red' or 'yellow'
        this.gameOver = false;
        this.winner = null;
        
        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.gameStatus = document.getElementById('game-status');
        this.resetButton = document.getElementById('reset-btn');
        this.currentPlayerToken = document.querySelector('.player-token');
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        // Initialize empty board
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = null;
            }
        }
        
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winner = null;
        
        this.updateDisplay();
        this.createBoard();
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.createCell(row, col);
                this.gameBoard.appendChild(cell);
            }
        }
    }
    
    createCell(row, col) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Add click event to handle column drops
        cell.addEventListener('click', () => this.handleColumnClick(col));
        
        return cell;
    }
    
    handleColumnClick(col) {
        if (this.gameOver) return;
        
        // Find the lowest empty cell in the column
        const row = this.getLowestEmptyRow(col);
        
        if (row !== -1) {
            this.placeToken(row, col);
            
            // Check for win
            if (this.checkWin(row, col)) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
                this.gameStatus.textContent = `${this.currentPlayer.toUpperCase()} wins!`;
                this.gameStatus.classList.add('winner');
            } else if (this.isBoardFull()) {
                this.gameOver = true;
                this.gameStatus.textContent = "It's a draw!";
                this.gameStatus.classList.add('draw');
            } else {
                // Switch players
                this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                this.updateDisplay();
            }
        }
    }
    
    getLowestEmptyRow(col) {
        // Start from the bottom row and work up
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                return row;
            }
        }
        return -1; // Column is full
    }
    
    placeToken(row, col) {
        this.board[row][col] = this.currentPlayer;
        
        // Update the visual representation
        const cellIndex = row * this.cols + col;
        const cell = this.gameBoard.children[cellIndex];
        cell.classList.add(this.currentPlayer);
    }
    
    checkWin(row, col) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [1, -1]   // diagonal down-left
        ];
        
        for (const [dr, dc] of directions) {
            if (this.checkDirection(row, col, dr, dc)) {
                return true;
            }
        }
        
        return false;
    }
    
    checkDirection(row, col, dr, dc) {
        const player = this.board[row][col];
        let count = 1;
        
        // Check in positive direction
        for (let i = 1; i < 4; i++) {
            const newRow = row + (dr * i);
            const newCol = col + (dc * i);
            
            if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // Check in negative direction
        for (let i = 1; i < 4; i++) {
            const newRow = row - (dr * i);
            const newCol = col - (dc * i);
            
            if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        return count >= 4;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    isBoardFull() {
        // Check if the top row is full
        for (let col = 0; col < this.cols; col++) {
            if (this.board[0][col] === null) {
                return false;
            }
        }
        return true;
    }
    
    updateDisplay() {
        // Update current player token
        this.currentPlayerToken.className = `player-token ${this.currentPlayer}`;
        
        // Update game status
        if (!this.gameOver) {
            this.gameStatus.textContent = `${this.currentPlayer.toUpperCase()}'s turn`;
            this.gameStatus.className = 'game-status';
        }
    }
    
    setupEventListeners() {
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
        });
    }
    
    resetGame() {
        // Add a nice transition effect
        this.gameBoard.style.opacity = '0.5';
        this.gameBoard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.initializeGame();
            this.gameBoard.style.opacity = '1';
            this.gameBoard.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Connect4();
}); 