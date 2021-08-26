import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { GameControlService } from '../../core/services/game-control/game-control.service';
import { map, tap } from 'rxjs/operators';

export class NameValidator {
  static occupied(gameControl: GameControlService) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return gameControl
        .httpValidation({
          lobby: control.get('lobby')?.value,
          name: control.get('name')?.value,
        })
        .pipe(
          map((data) => (data.name ? null : { occupied: true })),
          tap((data) => {
            control.get('name')?.setErrors(data);
          })
        );
    };
  }
}
