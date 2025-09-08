import { Component } from '@angular/core';
import { Header } from "./components/header/header";
import { Question } from "./components/question/question";
import { Answer } from "./components/answer/answer";
import { Footer } from "./components/footer/footer";

@Component({
    selector: 'app-task-manager',
    imports: [Header, Question, Answer, Footer],
    templateUrl: './task-manager.html',
    styleUrl: './task-manager.scss'
})
export class TaskManager {

}
