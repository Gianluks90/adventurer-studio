import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-equipaggiamento',
  templateUrl: './equipaggiamento.component.html',
  styleUrls: ['./equipaggiamento.component.scss']
})
export class EquipaggiamentoComponent {
  public group: FormGroup | null = null;
  public group2: FormGroup | null = null;

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('equipaggiamento') as FormGroup;
        this.group2 = form.get('denaro') as FormGroup;
        console.log(this.group.value);

      }
    });
  }
}
