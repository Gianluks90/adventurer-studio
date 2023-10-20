import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormModel } from 'src/app/models/formModel';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public form: FormGroup = this.fb.group(FormModel.create(this.fb))

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private notification: NotificationService,
    private sidenavService: SidenavService) { }

    public menuIcon = 'menu';

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.formService.initForm(characterId!);
    if (this.sidenavService.isOpen()) {
      const menuButton = document.getElementById('menu-button');
      this.menuIcon = 'close';
    }
  }

  public saveForm() {
    if (this.form.value.status.statusCode < 2) {
      const characterId = window.location.href.split('/').pop();
      this.formService.saveDraft(characterId, this.formService.formSubject.value);
      this.notification.openSnackBar('Bozza salvata con successo', 'check');
    } else {
      this.notification.openSnackBar('Non puoi salvare un Form Completo', 'warning');
    }
  }

  public completeForm() {
      const characterId = window.location.href.split('/').pop();
      this.formService.completeForm(characterId, this.form.value);
  }

  public previousStep() {
    this.stepper.previous();
  }

  public nextStep() {
    this.stepper.next();
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }
}
