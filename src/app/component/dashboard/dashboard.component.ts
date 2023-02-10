import { Component, OnInit } from '@angular/core';
import { faPencilAlt, faTrashAlt, faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { Task } from 'src/app/model/task';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements  OnInit {

  task: Task = new Task();
  tasks: Task[] = [];

  taskName: string = '';
  editedTaskName: string = '';

  faPencil = faPencilAlt;
  faTrashcan = faTrashAlt;
  faCheck = faCheck;
  faCancel = faBan;

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.taskName = '';
    this.editedTaskName = '';

    this.task = new Task();
    this.tasks = [];
    this.getAllTask();
  }

  getAllTask(): void {
    this.crudService.getAllTask().subscribe({
      next: (response: Task[]) => {
        this.tasks = response;
      },

      error: (error) => alert(error)
    });
  }

  addTask(): void {
    if(!this.taskName.trim())
      return;

    this.task.task_name = this.taskName;
    this.crudService.addTask(this.task).subscribe({
      next: (response: Task) => {
        this.ngOnInit();
        this.taskName = '';
      },
      error: (error) => alert(error)
    });
  }

  editTask(): void {
    this.task.task_name = this.editedTaskName;
    this.crudService.editTask(this.task).subscribe({
      next: (response: Task) => this.ngOnInit(),
      error: (error) => alert(error)
    });
  }

  deleteTask(task: Task): void {
    this.crudService.deleteTask(task).subscribe({
      next: (response: Task) => this.ngOnInit(),
      error: (error) => alert(error)
    });
  }

  doneTask(_task: Task): void {
    this.task = _task;
    this.task.done = !_task.done;

    this.crudService.editTask(this.task).subscribe({
      next: (response: Task) => this.ngOnInit(),
      error: (error) => console.log(error)
    });
  }

  call(task: Task): void {
    this.task = task;
    this.editedTaskName = task.task_name;
  }

  keypress(event: KeyboardEvent): void {
    let key = event.key;

    if(key === "Enter")
      this.addTask()
  }
}
