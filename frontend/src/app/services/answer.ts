import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { SubmitTask } from '../state/task.actions';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  answer = signal<string>("");

  private store = inject(Store);

  submitAnswer() {
    this.store.dispatch(new SubmitTask({ answer: this.answer().trim() }))
    this.answer.set("");
  }
}
