import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, HostListener, AfterViewChecked } from '@angular/core';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { ActivatedRoute } from '@angular/router';
// import { ChessCommunicationService } from '../services/chess-communication.service';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('board') board!: NgxChessBoardComponent;

  constructor(
    private route: ActivatedRoute,
    // private chessService: ChessCommunicationService
  ) { }

  ngOnInit(): void {
    window.addEventListener("message", this.receiveMove.bind(this), false);
  }

  ngAfterViewInit(): void {
    // Check if there is a saved game state in LocalStorage
    const savedGameState = localStorage.getItem('chessGameState');
    // console.log("Init check on Game State", savedGameState);
    if (savedGameState) {
      this.board.setPGN(savedGameState);
    }

    // This is the safest place to manipulate the board once it's fully initialized
    this.route.queryParams.subscribe(params => {
      if (params['rotate'] === 'true') {
        this.rotateBoard();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the event listener to prevent memory leaks
    window.removeEventListener("message", this.receiveMove.bind(this));
  }

  rotateBoard(): void {
    // Check if the board is ready and then call reverse
    if (this.board) {
      this.board.reverse();  // Flips the board to have black facing the player
    }
  }

  onMove(): void {
    const moveHistory = this.board.getMoveHistory();
    const lastMove = moveHistory.slice(-1)[0];

    if (lastMove && typeof lastMove.move === 'string') {
      // Save the current board position in PGN format to LocalStorage
      const pgnState = this.board.getPGN();
      localStorage.setItem('chessGameState', pgnState);
      window.parent.postMessage({ type: 'chessMove', lastMove: lastMove }, '*');
    } else {
      console.error("Error: Move data is not a valid string format:", lastMove);
    }
  }

  // enableResetButton(): void {
  //   const resetButton = document.getElementById('reset-button');
  //   if (resetButton) {
  //     resetButton.style.display = 'block';  // Make the reset button visible
  //   }
  // }

  // Listen for page unload to save the game state
  @HostListener('window:beforeunload')
  saveGameState() {
    const moveHistory = this.board.getPGN()
    // console.log(moveHistory);
    localStorage.setItem('chessGameState', moveHistory);
  }

  resetGame(): void {
    this.board.reset();
    localStorage.removeItem('chessGameState'); // Clear the saved game state
    //adjust the 2nd Iframe to rotate
    if (this.route.queryParams) {
      this.route.queryParams.subscribe(params => {
        if (params['rotate'] === 'true') {
          this.rotateBoard();
        }
      });
    }
  }


  receiveMove(event: MessageEvent): void {
    if (event.data.type === 'resetBoard') {
      this.resetGame()  // Resets the chess board
    }
    // Ensure the message is a valid chess move and apply it
    if (event.data && event.data.type === 'chessMove' && this.board) {
      const move = event.data.lastMove.move;
      // Ensure `move` is a string before trying to apply it
      if (typeof move === 'string') {
        // console.log("Applying received move:", move);
        this.board.move(move);
      } else {
        console.error("Error: Received move data is not a string:", move);
      }
    }
  }
  // detectCheckmate() {
  //   const gameStatus = this.board.getGameStatus();
  //   if (gameStatus === 'checkmate') {
  //     alert("Checkmate! Game Over.");
  //     // Optionally reset the board
  //     this.board.reset();
  //   }
  // }
}
