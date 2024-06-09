import { Component, Input } from '@angular/core';
import { Adventure } from '../adventure-editor/models/adventure';

@Component({
  selector: 'app-adventure-view',
  templateUrl: './adventure-view.component.html',
  styleUrl: './adventure-view.component.scss'
})
export class AdventureViewComponent {

  public adventureData: Adventure | null = null;
  @Input() set adventure(adventure: Adventure) {
    this.adventureData = adventure;
    // this.createSubtitle();
  }
}
