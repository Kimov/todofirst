import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {Task} from 'src/app/model/Task';

import {MatTableDataSource} from "@angular/material/table";
import {DataHandlerService} from "../../service/data-handler.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EditTaskDialogComponent} from "../../dialog/edit-task-dialog/edit-task-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit {

  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  public dataSource: MatTableDataSource<Task>; // контейнер - источник данных для таблицы
// текущие задачи для отображения на странице
  public tasks: Task[];
  @Output()
  updateTask = new EventEmitter<Task>();
  @Output()
  deleteTask = new EventEmitter<Task>();
  // ссылки на компоненты таблицы
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;

  constructor(private dataHandler: DataHandlerService,
              private dialog: MatDialog) // работа с диалоговым окном
  {
  }

  // текущие задачи для отображения на странице
  @Input('tasks')
  public set setTasks(tasks: Task[]) { // напрямую не присваиваем значения в переменную, только через @Input
    this.tasks = tasks;
    this.fillTable();
  }

  ngOnInit() {
    //  this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);

    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    this.dataSource = new MatTableDataSource();

    this.fillTable();
  }

  // в этом методе уже все проинциализировано, поэтому можно присваивать объекты (иначе может быть ошибка undefined)
  ngAfterViewInit(): void {

    this.addTableObjects();

  }


  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  // в зависимости от статуса задачи - вернуть цвет названия
  public getPriorityColor(task: Task) {

    // цвет завершенной задачи
    if (task.completed) {
      return '#F8F9FA'; // TODO вынести цвета в константы (magic strings, magic numbers)
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return '#fff'; // TODO вынести цвета в константы (magic strings, magic numbers)

  }

  // диалоговое редактирования для добавления задачи
  public openEditTaskDialog(task: Task): void {

    // открытие диалогового окна
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Редактирование задачи'],
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // обработка результатов
      // обработка результатов

      if (result === 'complete') {
        task.completed = true; // ставим статус задачи как выполненная
        this.updateTask.emit(task);
      }


      if (result === 'activate') {
        task.completed = false; // возвращаем статус задачи как невыполненная
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result as Task) { // если нажали ОК и есть результат
        this.updateTask.emit(task);
        return;
      }

    });
  }

  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  private fillTable() {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks; // обновить источник данных (т.к. данные массива tasks обновились)

    this.addTableObjects();


    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (task, colName) => {

      // по каким полям выполнять сортировку для каждого столбца
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
        case 'date': {
          return task.date ? task.date : null;
        }

        case 'title': {
          return task.title;
        }
      }
    };

  }

  private addTableObjects() {
    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
  }
}
