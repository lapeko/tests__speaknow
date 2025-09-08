import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task, TaskStateModel } from './task.model';
import { FetchTasks, SubmitTask } from './task.actions';
import { environment } from '../../environments/environment';

@State<TaskStateModel>({
  name: 'task',
  defaults: {
    tasks: [],
    loading: true,
  }
})
@Injectable()
export class TaskState {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  @Selector()
  static tasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Selector()
  static loading(state: TaskStateModel) {
    return state.loading;
  }

  @Action(FetchTasks)
  fetchTasks(ctx: StateContext<TaskStateModel>) {
    ctx.patchState({ loading: true });

    return this.http.get<Task[]>(environment.tasksApiUrl).pipe(
      tap((tasks) => ctx.patchState({ tasks: [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt)) })),
      catchError((err) => {
        console.error(err);
        this.snackBar.open("Fetch tasks failure", "Close", { duration: 4000 });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ loading: false })),
    );
  }

  @Action(SubmitTask)
  submitTask(ctx: StateContext<TaskStateModel>, action: SubmitTask) {
    ctx.patchState({ loading: true })
    return this.http.post(environment.tasksApiUrl, { answer: action.payload.answer }).pipe(
      switchMap(() => ctx.dispatch(new FetchTasks())),
      catchError((err) => {
        console.error(err);
        this.snackBar.open("Submit task failure", "Close", { duration: 4000 });
        ctx.patchState({ loading: false })
        return EMPTY;
      })
    );
  }
}