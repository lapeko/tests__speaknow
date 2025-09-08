import { AnswerService } from 'src/app/services/answer.service';
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-answer',
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './answer.html',
  styleUrl: './answer.scss'
})
export class Answer {
  private answerService = inject(AnswerService)

  answer = this.answerService.answer

  onAnswerChange(text: string) {
    this.answer.set(text);
  }
}
