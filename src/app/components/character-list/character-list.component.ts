import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  public characters: any[] = [];

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      this.characterService.getCharactersByUserId(userId).then(result => {
        this.characters = result;
        console.log(this.characters);
        
      })
    }
  }

}
