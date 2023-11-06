import {Component, NgZone} from '@angular/core';
import {GameService, GameState} from "../game.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  gameState: GameState = { time: 0, homeGoals: 0, awayGoals: 0, running: false, reset: false, homeTeam: 'Home', awayTeam: 'Away', halfTime: false, standardTime: 7*60 };

  reset = false;
  teamsToParse: string = '';
  teams: {teamName: string, tore: number}[][] = [];
  teamIndex = 0;
  private time = 0;

  constructor(private gameService: GameService, private zone: NgZone) {
    this.gameState.time = this.gameState.standardTime;
    this.gameService.updateGameState(this.gameState);
  }

  setTime(time: number) {
    this.zone.run(() => {
      this.gameState.time = time;
      this.gameService.updateGameState(this.gameState);
    });
  }

  emitTime(time: number) {
    this.time = time;
    this.gameService.setTime(time);
  }

  setRunning(b: boolean) {
    this.gameState.running = b;
    if(!b) {
      this.gameState.time = this.time;
    }
    this.gameService.updateGameState(this.gameState);
  }

    resetTime(reset?: boolean) {
      if(reset) {
        this.gameState.reset = true;
      } else {
        this.setTime(this.gameState.standardTime);
        this.zone.run(() => {
          this.reset = true;
          this.gameState.reset = true;
          this.gameService.updateGameState(this.gameState);
          console.log(this.gameState)
        });
      }
    }

  formatTime(time: number) {
    return Math.floor(time / 60) + ':' + ('0' + (time % 60)).slice(-2);
  }

  changeStandardTime() {
    this.zone.run(() => {
      if (this.gameState.standardTime == 7 * 60) {
        this.gameState.standardTime = 6 * 60;
      } else if (this.gameState.standardTime == 6 * 60) {
        this.gameState.standardTime = 5 * 60;
      } else {
        this.gameState.standardTime = 7 * 60;
      }
      this.gameState.time = this.gameState.standardTime;
      this.gameService.updateGameState(this.gameState);
    });
    console.log(this.gameState.standardTime);
  }

  changeHalfTime() {
    console.log("HalfTime", this.gameState.halfTime);
    this.zone.run(() => {
      if(this.gameState.halfTime && this.teams.length > 0) {
        this.teams.length > this.teamIndex ? this.teamIndex++ : null;
        this.setTeam(this.teams[this.teamIndex]);
      }
      this.gameState.halfTime = !this.gameState.halfTime;
      this.gameState.running = false;
      this.gameService.updateGameState(this.gameState);
    })
  }

  changeTime(time: number) {
    const newTime = this.gameState.time + time;
    if (newTime >= 0) {
      this.gameState.time = newTime;
      this.gameService.updateGameState(this.gameState);
    }
  }

  changeGoal(goalType: string, number: number) {
    this.zone.run(() => {
      // @ts-ignore
      this.gameState[goalType] += number;
      this.gameState = {...this.gameState};
      if(this.teams.length > 0) {
        this.teams[this.teamIndex][0].tore = this.gameState.homeGoals;
        this.teams[this.teamIndex][1].tore = this.gameState.awayGoals;
      }
      this.gameService.updateGameState(this.gameState);
      console.log(this.gameState);
    });
  }

  parseTeams(text: string): string[][] {
    // Entferne zuerst alle Leerzeilen oder Zeilen mit Zahlen und Punkten am Anfang
    const cleanedText = text.replace(/^\s*\d+\.\s*/gm, '');

    // Verwende den regulären Ausdruck, um die Mannschaftsnamen zu extrahieren
    const teamRegex = /([^\r\n:-]+)\s*-\s*([^\r\n:-]+)/g;
    const matches = [...cleanedText.matchAll(teamRegex)];

    // Erstelle ein Array von Mannschaftspaaren
    return matches.map(match => [match[1].trim(), match[2].trim()]);
  }

  onClickParseTeams() {
    this.teams = this.parseTeams(this.teamsToParse).map(team => {
      return [{teamName: team[0], tore: 0}, {teamName: team[1], tore: 0}];
    });
    if(this.teams.length > 0) {
      this.gameState.homeTeam = this.replaceUmlaute(this.teams[0][0].teamName);
      this.gameState.awayTeam = this.replaceUmlaute(this.teams[0][1].teamName)
    }
    this.gameService.updateGameState(this.gameState);
  }

  replaceUmlaute(str: string) {
    const umlautMap = {
      '\u00dc': 'UE',
      '\u00c4': 'AE',
      '\u00d6': 'OE',
      '\u00fc': 'ue',
      '\u00e4': 'ae',
      '\u00f6': 'oe',
      '\u00df': 'ss',
    }
    return str
        .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
          // @ts-ignore
          const big = umlautMap[a.slice(0, 1)];
          return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
        })
        .replace(new RegExp('['+Object.keys(umlautMap).join('|')+']',"g"),
            // @ts-ignore
            (a) => umlautMap[a]
        );
  }

  setTeam(team: {teamName: string, tore: number}[]) {
    this.zone.run(() => {
      this.gameState.homeTeam = this.replaceUmlaute(team[0].teamName);
      this.gameState.awayTeam = this.replaceUmlaute(team[1].teamName);
      this.gameState.homeGoals = 0;
      this.gameState.awayGoals = 0;
      this.gameService.updateGameState(this.gameState);
      this.gameState = {...this.gameState};
    });
  }
}
