import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonReorder,
  IonReorderGroup,
  ReorderEndCustomEvent
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { Alert } from '../../service/alert';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
    IonIcon,
    IonList,
    IonLabel,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonReorder,
    IonReorderGroup
  ],
})
export class HomePage {
  private alertService: Alert = inject(Alert);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public tasks: string[] = [];
  public task: string = '';

  private readonly KEY_TASKS = 'mis_tareas';

  constructor() {
    addIcons({
      addOutline,
      trashOutline
    });
  }

  async ionViewWillEnter() {
    const result = await Preferences.get({
      key: this.KEY_TASKS
    });

    if (result.value) {
      try {
        const savedTasks = JSON.parse(result.value);

        this.tasks = Array.isArray(savedTasks) &&
          savedTasks.every((item: unknown) => typeof item === 'string')
          ? savedTasks
          : [];
      } catch {
        this.tasks = [];
      }
    } else {
      this.tasks = [];
    }

    this.cdr.detectChanges();
  }

  saveTasks() {
    Preferences.set({
      key: this.KEY_TASKS,
      value: JSON.stringify(this.tasks)
    });
  }

  addTask() {
    const newTask = this.task.trim();

    if (!newTask) {
      return;
    }

    if (!this.ifExistTask(newTask)) {
      this.tasks.push(newTask);
      this.saveTasks();
      this.task = '';

      this.alertService.AlertMessage(
        'Tarea agregada',
        'La tarea se ha agregado correctamente'
      );
    } else {
      this.alertService.AlertMessage(
        'Tarea ya existe',
        'La tarea que intenta agregar ya existe en la lista'
      );
    }
  }

  private ifExistTask(task: string) {
    return this.tasks.find(
      (item: string) =>
        task.toUpperCase().trim() === item.toUpperCase().trim()
    );
  }

  confirmDeleteTask(task: string) {
    this.alertService.alertConfirm(
      'Confirmar eliminación',
      'Eliminar tarea',
      '¿Está seguro de que desea eliminar esta tarea?',
      () => this.deleteTask(task)
    );
  }

  private deleteTask(task: string) {
    const index = this.tasks.findIndex(
      (item: string) =>
        item.toLowerCase().trim() === task.toLowerCase().trim()
    );

    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.cdr.markForCheck();
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    const { from, to, complete } = event.detail;

    if (from !== to && to >= 0 && to < this.tasks.length) {
      const itemMoved = this.tasks.splice(from, 1)[0];
      this.tasks.splice(to, 0, itemMoved);
      this.saveTasks();
    }

    complete();
  }
}