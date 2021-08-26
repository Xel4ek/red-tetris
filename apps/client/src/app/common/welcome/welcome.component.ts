import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  GameControlService,
  ValidateDto,
} from '../../core/services/game-control/game-control.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { NameValidator } from '../name-validator/name-validator';

@Component({
  selector: 'red-tetris-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnDestroy {
  registerFormGroup: FormGroup;
  validation$: Observable<ValidateDto>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly title: Title,
    private readonly gameControlService: GameControlService
  ) {
    this.title.setTitle('Welcome');
    this.validation$ = gameControlService.validation();
    this.registerFormGroup = formBuilder.group(
      {
        lobby: ['', Validators.required],
        name: ['', Validators.required],
      },
      { asyncValidators: NameValidator.occupied(this.gameControlService) }
    );
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.registerFormGroup.get('name')?.setValue(state?.name);
      this.registerFormGroup.get('lobby')?.setValue(state?.lobby);
      this.registerFormGroup.markAllAsTouched();
    }
    this.registerFormGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.gameControlService.validate(data))
      )
      .subscribe();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
