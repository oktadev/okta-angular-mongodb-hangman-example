import { Component, OnInit } from '@angular/core';
import { HangmanService } from '../hangman.service';

interface UserScore {
  username: string;
  score: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: UserScore[];
  loading = true;

  constructor(private hangman: HangmanService) { }

  async ngOnInit() {
    this.leaderboard = await this.hangman.getLeaderboard();
    this.loading = false;
  }
}
