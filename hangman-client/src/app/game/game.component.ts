import { Component, OnInit } from '@angular/core';
import { HangmanService } from '../hangman.service';

interface Game {
  status: string;
  clue: string;
  guesses: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  loading = true;

  constructor(private hangman: HangmanService) { }

  async ngOnInit() {
    this.game = await this.hangman.getGame();
    this.loading = false;
  }

  getGuessed() {
    return this.game.guesses.split('').sort();
  }

  getNotGuessed() {
    const guesses = this.game.guesses.split('');
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => !guesses.includes(c));
  }

  async guess(c: string) {
    this.loading = true;
    this.game = await this.hangman.guessGame(c);
    this.loading = false;
  }

  async newGame() {
    this.loading = true;
    this.game = await this.hangman.getGame();
    this.loading = false;
  }
}
