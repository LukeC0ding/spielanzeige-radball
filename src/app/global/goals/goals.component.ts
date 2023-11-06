import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent {
  @Input() set gameState(gameState: any) {
    if (gameState) {
      this.homeGoals = gameState.homeGoals;
      this.awayGoals = gameState.awayGoals;
      this.homeTeam = gameState.homeTeam;
      this.awayTeam = gameState.awayTeam;
    }
  }

  homeGoals: number = 0;
  awayGoals: number = 0;
  homeTeam: string = 'Home';
  awayTeam: string = 'Away';
}
