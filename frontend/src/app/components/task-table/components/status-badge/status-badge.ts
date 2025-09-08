import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TaskStatus } from 'src/app/utils/types';


@Component({
  selector: 'app-status-badge',
  imports: [MatIconModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss'
})
export class StatusBadge {
  status = input<TaskStatus>(TaskStatus.Pending);
  TaskStatus = TaskStatus
}
