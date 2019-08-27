import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HangmanService } from '../hangman.service';

interface Profile {
  email: string;
  username: string;
  score: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;

  loading = true;
  profile?: Profile;

  constructor(private fb: FormBuilder,
              private hangman: HangmanService) { }

  async ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
    });

    try {
      this.profile = await this.hangman.getProfile();
    } catch (err) {}
    this.loading = false;
  }

  async onSubmitUsername() {
    await this.hangman.updateUser(this.form.get('username').value);
    this.profile = await this.hangman.getProfile();
  }
}
