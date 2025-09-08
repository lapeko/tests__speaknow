import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { AnswerService } from 'src/app/services/answer';
import { TaskState } from 'src/app/state/task.state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  imports: [MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  private answerService = inject(AnswerService);
  private store = inject(Store);

  loading = toSignal(this.store.select(TaskState.loading))
  answerEmpty = computed(() => this.answerService.answer().trim() === "");

  onSubmit() {
    this.answerService.submitAnswer();
  }
}
