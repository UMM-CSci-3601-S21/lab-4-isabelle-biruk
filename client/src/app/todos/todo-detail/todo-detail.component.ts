import { TodoService } from './../todo.service';
import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent implements OnInit {


  todo: Todo;
  id: string;

  constructor(private route: ActivatedRoute, private todoService: TodoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.todoService.getTodoById(this.id).subscribe(todo => this.todo = todo);
      console.log(this.id);
    });
  }
}
