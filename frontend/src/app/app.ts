import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { TaskManager } from "./components/task-manager/task-manager";
import { TaskTable } from "./components/task-table/task-table";
import { FetchTasks } from './state/task.actions';

@Component({
  selector: 'app-root',
  imports: [TaskManager, TaskTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store)

  ngOnInit(): void {
    this.store.dispatch(new FetchTasks());
  }
}
