import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoneyDialogComponent } from './money-dialog/money-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { NotificationService } from 'src/app/services/notification.service';
import { FormService } from 'src/app/services/form.service';
import { FormGroup } from '@angular/forms';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-equipaggiamento-tab-view',
  templateUrl: './equipaggiamento-tab-view.component.html',
  styleUrls: ['./equipaggiamento-tab-view.component.scss']
})
export class EquipaggiamentoTabViewComponent {

  public equipaggiamentoData: string = '';
  public denaroData: any = {};

  public denaroForm: FormGroup | null = null;

  constructor(private dialog: MatDialog, private platform: Platform, private notification: NotificationService, private formService: FormService, private charService: CharacterService) { }

  @Input() set equipaggiamento(value: string) {
    this.equipaggiamentoData = value;
  }

  @Input() set denaro(value: any) {
    this.denaroData = value;
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.denaroForm = form.get('denaro') as FormGroup;
      }
    });
  }

  public openMoneyDialog() {
    const characterId = window.location.href.split('/').pop();
    this.dialog.open(MoneyDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      data: {
        group: this.denaroForm,
      }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.denaroData = result.newValue.value;
        console.log(this.denaroData);
        this.charService.updateMoney(characterId, this.denaroData).then(() => {
          this.notification.openSnackBar('Denaro aggiornato.', 'toll', 3000, 'limegreen');
        });
      }
    });
  }
}
