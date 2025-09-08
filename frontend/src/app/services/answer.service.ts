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
    const text = this.answer().trim();
    if (!text) return;
    this.store.dispatch(new SubmitTask({ answer: text }))
    this.answer.set("");
  }
}
