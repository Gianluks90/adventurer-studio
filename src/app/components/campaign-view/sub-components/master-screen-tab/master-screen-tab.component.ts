import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-master-screen-tab',
  templateUrl: './master-screen-tab.component.html',
  styleUrl: './master-screen-tab.component.scss'
})
export class MasterScreenTabComponent {

  public screenContent: any;

  constructor(private http: HttpClient) {
    this.http.get('./assets/settings/screenMaster.json').subscribe(data => {
      this.parseJson(data);
    });
  }

  private parseJson(data: any) {
    data.forEach((group: any) => {
      if (group.orderedList) {
        group.list.forEach(item => {
          item.description = this.splitDescriptionIntoSentences(item.description);
        });
      }
    });
    this.screenContent = data;
    console.log('screenContent: ', this.screenContent);
    
  }

  private splitDescriptionIntoSentences(description) {
    return description.split(". ");
  }

  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }
}
