import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  addTodoValidationMessages = {
    owner: [
      { type: 'required', message: 'Owner is required' },
      { type: 'minlength', message: 'Owner must be at least 2 characters long' },
      { type: 'maxlength', message: 'Owner cannot be more than 50 characters long' },
    ],

    category: [
      { type: 'required', message: 'Category is required' },
      { type: 'minlength', message: 'Category must be at least 2 characters long' },
      { type: 'maxlength', message: 'Category cannot be more than 50 characters long' },
    ],

    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be complete or incomplete' }
    ],

    body: [
      { type: 'required', message: 'Body is required' },
      { type: 'minlength', message: 'Body must be at least 2 characters long' },
      { type: 'maxlength', message: 'Body cannot be more than 200 characters long' },
    ]
  };

  constructor(private fb: FormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add Todo form validations
    this.addTodoForm = this.fb.group({

      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),

      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(101),

      ])),

      status: new FormControl('incomplete', Validators.compose([
        Validators.required,
      ])),

      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    console.log(this.addTodoForm.value);
    const { owner, body, status, category } = this.addTodoForm.value;

    this.todoService.addTodo({
      _id: undefined,
      owner,
      status: status !== undefined ? status === 'complete' : undefined,
      body,
      category
    }).subscribe(newID => {
      this.snackBar.open('Added Todo ' + this.addTodoForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the Todo', 'OK', {
        duration: 5000,
      });
      console.log(err);
    });
  }

}
