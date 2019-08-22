import { TestBed } from '@angular/core/testing';

import { HangmanService } from './hangman.service';

describe('HangmanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HangmanService = TestBed.get(HangmanService);
    expect(service).toBeTruthy();
  });
});
