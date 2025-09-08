import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngxs/store';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TaskState } from 'src/app/state/task.state';
import { Task } from 'src/app/state/task.model';
import { FetchTasks } from 'src/app/state/task.actions';
import { StatusBadge } from './components/status-badge/status-badge';


@Component({
  selector: 'app-task-table',
  imports: [MatProgressSpinnerModule, MatTableModule, AsyncPipe, MatIconModule, MatButtonModule, StatusBadge],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss'
})
export class TaskTable {
  private store = inject(Store);

  loading$ = this.store.select(TaskState.loading);
  tasks$ = this.store.select(TaskState.tasks);

  displayedColumns: (keyof Task | 'actions')[] = ['taskId', 'answer', 'status', 'retries', 'errorMessage', 'actions'];

  refresh() {
    this.store.dispatch(FetchTasks);
  }
}
