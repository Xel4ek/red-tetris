import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { RoleService } from '../../services/role/role.service';
import { Role } from '../../interfaces/role';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[redTetrisSecure]',
})
export class SecureDirective implements OnDestroy {
  private subscription?: Subscription;
  constructor(
    private readonly element: ElementRef,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly roleService: RoleService
  ) {}
  @Input()
  set redTetrisSecure(role: Role) {
    this.subscription = this.roleService.role().subscribe((code) => {
      if (code >= role) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
