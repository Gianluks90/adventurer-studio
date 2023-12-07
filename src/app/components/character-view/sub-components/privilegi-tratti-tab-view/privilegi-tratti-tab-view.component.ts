import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-privilegi-tratti-tab-view',
  templateUrl: './privilegi-tratti-tab-view.component.html',
  styleUrls: ['./privilegi-tratti-tab-view.component.scss']
})
export class PrivilegiTrattiTabViewComponent {

  public privilegiTrattiData: any[] = [];
  public razzaData: string = '';
  public classiData: any[] = []
  constructor() { }

  @Input() set privilegiTratti(privilegiTratti: any) {
    this.privilegiTrattiData = privilegiTratti;
  }

  @Input() set informazioniBase(informazioniBase: any) {
    this.razzaData = informazioniBase.razza;
    this.classiData = informazioniBase.classi;
  }

}
