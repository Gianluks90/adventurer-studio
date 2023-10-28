import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-privilegi-tratti-tab-view',
  templateUrl: './privilegi-tratti-tab-view.component.html',
  styleUrls: ['./privilegi-tratti-tab-view.component.scss']
})
export class PrivilegiTrattiTabViewComponent {

  public privilegiTrattiData: any[] = [];
  constructor() { }

  @Input() set privilegiTratti(privilegiTratti: any) {
    this.privilegiTrattiData = privilegiTratti;
    console.log(privilegiTratti);
    
  }

}
