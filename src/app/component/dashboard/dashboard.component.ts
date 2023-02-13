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

  isLoading: boolean = false;
  isDeleting: boolean = false;
  tasks: Task[] = [];
  editedTask?: Task;

  taskName: string = '';
  editedTaskName: string = '';

  faPencil = faPencilAlt;
  faTrashcan = faTrashAlt;
  faCheck = faCheck;
  faCancel = faBan;

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.getAllTask();
  }

  getAllTask(): void {
    this.crudService.getAllTask().subscribe({
      next: (response: Task[]) => {
        this.tasks = response;
      },

      error: (error) => {
        this.isLoading = false;
        console.log(error.message)
      }
    });
  }

  addTask(): void {
    if(this.isLoading) return;
    this.isLoading = true;

    if(!this.taskName.trim())
      return;

    const task = new Task(this.tasks.length + 1, this.taskName);
    this.crudService.addTask(task).subscribe({
      next: (response: Task) => {
        this.tasks.push(response);
        this.taskName = '';

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error.message)
      }
    });
  }

  editTask(edit: Task, done: boolean = false): void {
    if(this.isLoading) return;
    this.isLoading = true;

    if(!edit.id) {
      this.isLoading = false;
      return;
    }

    if(edit.isOpen) {
      edit.isOpen = false;
    }

    const task = new Task(edit.id, this.editedTaskName === "" ? edit.task_name : this.editedTaskName);
    task.done = done ?? edit.done;

    if(this.isDeleting) {
      task.deleted();
    }

    this.crudService.editTask(edit.id, task).subscribe({
      next: (response: Task) => {
        const list = this.tasks.map((task) => {
          if(task.id === response.id) {
            return response;
          }
          return task;
        });

        this.tasks = list;
        this.isLoading = false;
        this.isDeleting = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.isDeleting = false;
        console.log(error.message)
      }
    });
  }

  deleteTask(task: Task): void {
    if(this.isDeleting) return;
    this.isDeleting = true;

    this.editTask(task);
  }

  modalEditTask() {
    this.editTask(this.editedTask!);
  }

  call(task: Task): void {
    this.editedTaskName = task.task_name;
    this.editedTask = task;
    task.isOpen = true;
  }

  keypress(event: KeyboardEvent): void {
    let key = event.key;

    if(key === "Enter")
      this.addTask()
  }
}
