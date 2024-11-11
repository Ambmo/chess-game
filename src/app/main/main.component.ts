import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  iframe1Url: SafeResourceUrl;
  iframe2Url: SafeResourceUrl;
  isWhiteTurn: boolean = true; // True means it’s white’s turn, false means it’s black’s
  isBlackTurn: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
    this.iframe1Url = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:4200/iframe?rotate=false');
    this.iframe2Url = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:4200/iframe?rotate=true');
  }

  ngOnInit(): void {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }


  receiveMessage(event: MessageEvent): void {
    const iframe1 = document.getElementById('iframe1') as HTMLIFrameElement;
    const iframe2 = document.getElementById('iframe2') as HTMLIFrameElement;

    // Ensure the message is a valid chess move
    if (event.data && event.data.type === 'chessMove') {
      // Check if it's checkmate
      // console.log("Data inside main sent from child", event.data.lastMove);
      if (event.data.lastMove && event.data.lastMove.mate) {
        this.handleCheckmate();
        return;
      }
      // Relay the message to the other iframe
      if (event.source === iframe1.contentWindow) {
        iframe2.contentWindow?.postMessage(event.data, '*');
        this.isWhiteTurn = !this.isWhiteTurn; // Toggle white turn
      // console.log('Turn changed. Is white turn:', this.isWhiteTurn); // Debugging line
      } else if (event.source === iframe2.contentWindow) {
        iframe1.contentWindow?.postMessage(event.data, '*');
        this.isBlackTurn = !this.isBlackTurn; // Toggle black turn
      // console.log('Turn changed. Is black turn:', this.isBlackTurn); // Debugging line
      }
    }
  }

  handleCheckmate(): void {
    const resetConfirmed = confirm("Checkmate! Would you like to start a new game?");
    if (resetConfirmed) {
      this.resetBoards();
    }
  }

  resetBoards(): void {
    const iframe1 = document.getElementById('iframe1') as HTMLIFrameElement;
    const iframe2 = document.getElementById('iframe2') as HTMLIFrameElement;
    
    // Send a reset message to both iframes
    iframe1.contentWindow?.postMessage({ type: 'resetBoard' }, '*');
    iframe2.contentWindow?.postMessage({ type: 'resetBoard' }, '*');

    // Reset the turn to white’s turn
    this.isWhiteTurn = true;
    this.isBlackTurn = false;
  }

}
