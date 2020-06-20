import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from '../model/Task';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categorySubject = new BehaviorSubject<Category[]>(TestData.categories);

  constructor() {
  }

  // getCategories(): Category[] {
  //   return TestData.categories;
  //}

  fillTask() {
    this.taskSubject.next(TestData.tasks);
  }

  fillTaskByCategory(category: Category) {
    const tasks = TestData.tasks.filter(task => task.category === category);
    this.taskSubject.next(tasks);
    return tasks;
  }

}

