import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface GameState {
  time: number;
  homeGoals: number;
  awayGoals: number;
  running: boolean;
  reset: boolean;
  homeTeam: string;
  awayTeam: string;
  halfTime: boolean;
  standardTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  private gameStateSource = new BehaviorSubject<GameState>({ time: 0, homeGoals: 0, awayGoals: 0, running: false, reset: false, homeTeam: 'Home', awayTeam: 'Away', halfTime: false, standardTime: 7*60 });
  private broadcastChannel: BroadcastChannel;

  constructor(private zone: NgZone) {
    this.broadcastChannel = new BroadcastChannel('game_channel');
    const gameState = JSON.parse(localStorage.getItem('gameState') || '{}' );
    if(Object.keys(gameState).length > 0) {
        this.updateGameState(gameState);
    }
    this.broadcastChannel.onmessage = (message) => {
      this.zone.run(() => { // Führen Sie dies innerhalb der Angular Zone aus
        if (message.data) {
          const newState: GameState = message.data;
          this.gameStateSource.next(newState);
        }
      });
    };
  }

  // Methode zum Senden des aktuellen Spielstands
  updateGameState(state: GameState) {
    this.broadcastChannel.postMessage(state);
    localStorage.setItem('gameState', JSON.stringify(state));
    this.gameStateSource.next(state);
  }

  getCurrentGameState() {
    return this.gameStateSource.asObservable();
  }

  // Räumt den Broadcast Channel auf, wenn der Service zerstört wird
  ngOnDestroy() {
    this.broadcastChannel.close();
  }

  setTime(time: number) {
    const state = { ...this.gameStateSource.getValue(), time: time };
    this.broadcastChannel.postMessage(state);
  }
}
