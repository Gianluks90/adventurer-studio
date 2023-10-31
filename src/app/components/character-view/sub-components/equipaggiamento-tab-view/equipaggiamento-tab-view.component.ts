import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-equipaggiamento-tab-view',
  templateUrl: './equipaggiamento-tab-view.component.html',
  styleUrls: ['./equipaggiamento-tab-view.component.scss']
})
export class EquipaggiamentoTabViewComponent {

  public equipaggiamentoData: string = '';
  public denaroData: any = {};

  constructor() { }

  @Input() set equipaggiamento(value: string) {
    this.equipaggiamentoData = value;
  }

  @Input() set denaro(value: any) {
    this.denaroData = value;
    console.log(this.denaroData);
    
  }
}
