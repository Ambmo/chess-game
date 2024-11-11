import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessCommunicationService {
  private moveSubject = new Subject<string>();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initMessageListener();
  }

  private initMessageListener(): void {
    this.renderer.listen('window', 'message', (event: MessageEvent) => {
      if (event.data && event.data.type === 'chessMove') {
        this.moveSubject.next(event.data.move);
      }
    });
  }

  sendMoveToParent(move: string): void {
    window.parent.postMessage({ type: 'chessMove', move }, '*');
  }

  relayMove(targetWindow: Window, move: string): void {
    targetWindow.postMessage({ type: 'chessMove', move }, '*');
  }

  getMoveObservable(): Observable<string> {
    return this.moveSubject.asObservable();
  }
}
