import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-char-list',
  templateUrl: './campaign-char-list.component.html',
  styleUrl: './campaign-char-list.component.scss'
})
export class CampaignCharListComponent {

  public charData: any[] = [];

  @Input() set characters(characters: any[]) {
    console.log(characters);
    
    this.charData = characters;
  }

  constructor() { }
}
