import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormModel } from 'src/app/models/formModel';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';

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
    private formService: FormService,
    private menuService: MenuService) { }

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.formService.initForm(characterId!);
    this.menuService.hiddenButton = [''];
  }

  public saveForm() {
    if (this.form.value.status.draft) {
      const characterId = window.location.href.split('/').pop();
      this.formService.saveDraft(characterId, this.form.value);
    } else {
      alert('Non puoi salvare un form completo');
    }

  }

  public completeForm() {
    if (this.form.valid) {
      const characterId = window.location.href.split('/').pop();
      // this.formService.completeForm(characterId, this.form.value);
    } else {
      alert('Non hai compilato tutti i campi obbligatori');
    }
  }

  public previousStep() {
    this.stepper.previous();
  }

  public nextStep() {
    this.stepper.next();
  }


}
