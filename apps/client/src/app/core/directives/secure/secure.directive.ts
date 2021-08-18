import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Role } from '../../interfaces/role';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile/profile.service';
import { Profile } from '../../interfaces/profile';

@Directive({
  selector: '[redTetrisSecure]',
})
export class SecureDirective implements OnDestroy {
  private subscription?: Subscription;
  constructor(
    private readonly element: ElementRef,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly roleService: ProfileService
  ) {}
  @Input()
  set redTetrisSecure(role: Role) {
    this.subscription = this.roleService
      .profile()
      .subscribe(({ role: code }: Profile) => {
        this.viewContainer.clear();
        if (code >= role) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
