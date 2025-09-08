export class FetchTasks {
  static readonly type = '[Task] Fetch All';
}

export class SubmitTask {
  static readonly type = '[Task] Submit';
  constructor(public payload: { answer: string }) { }
}
