class Connect4Multiplayer {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winner = null;
        this.isHost = false;
        this.roomCode = '';
        this.playerName = '';
        this.opponentName = '';
        this.gameStarted = false;
        this.myTurn = false;
        
        // DOM elements
        this.menuContainer = document.getElementById('menu-container');
        this.gameContainer = document.getElementById('game-container');
        this.gameBoard = document.getElementById('game-board');
        this.gameStatus = document.getElementById('game-status');
        this.resetButton = document.getElementById('reset-btn');
        this.currentPlayerToken = document.getElementById('current-player-token');
        this.roomCodeDisplay = document.getElementById('room-code-display');
        this.hostNameDisplay = document.getElementById('host-name-display');
        this.guestNameDisplay = document.getElementById('guest-name-display');
        this.leaveRoomBtn = document.getElementById('leave-room-btn');
        
        // Menu elements
        this.createRoomBtn = document.getElementById('create-room-btn');
        this.joinRoomBtn = document.getElementById('join-room-btn');
        this.createRoomModal = document.getElementById('create-room-modal');
        this.joinRoomModal = document.getElementById('join-room-modal');
        
        this.setupEventListeners();
        this.showMenu();
    }
    
    setupEventListeners() {
        // Menu buttons
        this.createRoomBtn.addEventListener('click', () => this.showCreateRoomModal());
        this.joinRoomBtn.addEventListener('click', () => this.showJoinRoomModal());
        
        // Modal buttons
        document.getElementById('create-room-confirm').addEventListener('click', () => this.createRoom());
        document.getElementById('create-room-cancel').addEventListener('click', () => this.hideCreateRoomModal());
        document.getElementById('join-room-confirm').addEventListener('click', () => this.joinRoom());
        document.getElementById('join-room-cancel').addEventListener('click', () => this.hideJoinRoomModal());
        
        // Game buttons
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
            if (e.key === 'Escape') {
                this.leaveRoom();
            }
        });
    }
    
    showMenu() {
        this.menuContainer.style.display = 'block';
        this.gameContainer.style.display = 'none';
    }
    
    showGame() {
        this.menuContainer.style.display = 'none';
        this.gameContainer.style.display = 'block';
    }
    
    showCreateRoomModal() {
        this.createRoomModal.style.display = 'flex';
        document.getElementById('host-name').focus();
    }
    
    hideCreateRoomModal() {
        this.createRoomModal.style.display = 'none';
        document.getElementById('host-name').value = '';
    }
    
    showJoinRoomModal() {
        this.joinRoomModal.style.display = 'flex';
        document.getElementById('player-name').focus();
    }
    
    hideJoinRoomModal() {
        this.joinRoomModal.style.display = 'none';
        document.getElementById('player-name').value = '';
        document.getElementById('room-code').value = '';
    }
    
    createRoom() {
        const hostName = document.getElementById('host-name').value.trim();
        if (!hostName) {
            alert('Please enter your name');
            return;
        }
        
        this.isHost = true;
        this.playerName = hostName;
        this.roomCode = this.generateRoomCode();
        this.hostNameDisplay.textContent = hostName;
        this.roomCodeDisplay.textContent = this.roomCode;
        
        this.hideCreateRoomModal();
        this.showGame();
        this.initializeGame();
        this.gameStatus.textContent = 'Waiting for opponent to join...';
        
        // Simulate opponent joining after 2 seconds (for demo)
        setTimeout(() => {
            this.opponentName = 'Player2';
            this.guestNameDisplay.textContent = this.opponentName;
            this.gameStarted = true;
            this.myTurn = true;
            this.gameStatus.textContent = 'Game started! Your turn';
            this.updateDisplay();
        }, 2000);
    }
    
    joinRoom() {
        const playerName = document.getElementById('player-name').value.trim();
        const roomCode = document.getElementById('room-code').value.trim();
        
        if (!playerName || !roomCode) {
            alert('Please enter both your name and room code');
            return;
        }
        
        this.isHost = false;
        this.playerName = playerName;
        this.roomCode = roomCode;
        this.opponentName = 'Host';
        this.hostNameDisplay.textContent = 'Host';
        this.guestNameDisplay.textContent = playerName;
        this.roomCodeDisplay.textContent = roomCode;
        
        this.hideJoinRoomModal();
        this.showGame();
        this.initializeGame();
        this.gameStatus.textContent = 'Joined room! Waiting for host to start...';
        
        // Simulate game starting after 1 second (for demo)
        setTimeout(() => {
            this.gameStarted = true;
            this.myTurn = false;
            this.gameStatus.textContent = 'Game started! Opponent\'s turn';
            this.updateDisplay();
        }, 1000);
    }
    
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    leaveRoom() {
        this.showMenu();
        this.gameStarted = false;
        this.myTurn = false;
        this.gameOver = false;
        this.winner = null;
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
        if (this.gameOver || !this.gameStarted || !this.myTurn) return;
        
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
                this.myTurn = !this.myTurn;
                this.updateDisplay();
                
                if (this.myTurn) {
                    this.gameStatus.textContent = 'Your turn';
                } else {
                    this.gameStatus.textContent = 'Opponent\'s turn';
                    // Simulate opponent move after 1 second (for demo)
                    setTimeout(() => {
                        this.makeOpponentMove();
                    }, 1000);
                }
            }
        }
    }
    
    makeOpponentMove() {
        if (this.gameOver || this.myTurn) return;
        
        // Simple AI: find a random valid column
        const validColumns = [];
        for (let col = 0; col < this.cols; col++) {
            if (this.getLowestEmptyRow(col) !== -1) {
                validColumns.push(col);
            }
        }
        
        if (validColumns.length > 0) {
            const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
            const row = this.getLowestEmptyRow(randomCol);
            this.placeToken(row, randomCol);
            
            // Check for win
            if (this.checkWin(row, randomCol)) {
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
                this.myTurn = true;
                this.updateDisplay();
                this.gameStatus.textContent = 'Your turn';
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
            if (!this.gameStarted) {
                this.gameStatus.textContent = 'Waiting for players...';
            } else if (this.myTurn) {
                this.gameStatus.textContent = 'Your turn';
            } else {
                this.gameStatus.textContent = 'Opponent\'s turn';
            }
            this.gameStatus.className = 'game-status';
        }
    }
    
    resetGame() {
        if (!this.gameStarted) return;
        
        // Add a nice transition effect
        this.gameBoard.style.opacity = '0.5';
        this.gameBoard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.initializeGame();
            this.myTurn = this.isHost; // Host goes first
            this.gameBoard.style.opacity = '1';
            this.gameBoard.style.transform = 'scale(1)';
            this.updateDisplay();
        }, 200);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Connect4Multiplayer();
}); 