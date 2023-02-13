export class Task {
  done: boolean = false;
  isDeleted: boolean = false;
  isOpen: boolean = false;
  id: number | null;

  constructor(id: number, public task_name: string) {
    this.id = id;
  }

  deleted() {
    this.isDeleted = true;
    this.id = null;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
