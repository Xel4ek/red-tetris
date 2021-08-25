import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'red-tetris-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  registerFormGroup: FormGroup;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly title: Title
  ) {
    this.title.setTitle('Welcome');

    this.registerFormGroup = formBuilder.group({
      lobby: ['', Validators.required],
      name: ['', Validators.required],
    });
  }
  redirect() {
    this.router.navigate(['/'], {
      fragment:
        this.registerFormGroup.controls['lobby'].value +
        '[' +
        this.registerFormGroup.controls['name'].value +
        ']',
    });
  }
}
