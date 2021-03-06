import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from '../model/Task';
import {BehaviorSubject, Observable} from "rxjs";
import {TaskDAOArray} from "../data/dao/impl/TaskDAOArray";
import {CategoryDAOArray} from "../data/dao/impl/CategoryDAOArray";
import {Priority} from "../model/Priority";
import {PriorityDAOArray} from "../data/dao/impl/PriorityDAOArray";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor() {
  }

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.priorityDaoArray.getAll();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryDaoArray.getAll();
  }

  deleteTask(id: number): Observable<Task> {
    return this.taskDaoArray.delete(id);
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

// поиск задач по параметрам
  searchTasks(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

}

