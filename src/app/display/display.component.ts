import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService, GameState} from "../game.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy, OnInit {
  gameState: GameState = { time: 0, homeGoals: 0, awayGoals: 0, running: false, reset: false, homeTeam: 'Home', awayTeam: 'Away', halfTime: false, standardTime: 7*60 };
  private gameSubscription: Subscription | undefined;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameSubscription = this.gameService.getCurrentGameState().subscribe(state => {
      console.log(state);
      this.gameState = state;
      console.log(this.gameState);
    });
  }

  ngOnDestroy() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }
}
