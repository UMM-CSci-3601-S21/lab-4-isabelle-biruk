import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent implements OnInit {

  // Current Todo
  @Input() todo: Todo;

  constructor() { }


  ngOnInit(): void {
    // console.log(this.todo);
  }

}
