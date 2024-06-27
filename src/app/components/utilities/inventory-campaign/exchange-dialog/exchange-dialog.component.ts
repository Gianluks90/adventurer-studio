import { Component, Inject, effect } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-exchange-dialog',
  templateUrl: './exchange-dialog.component.html',
  styleUrl: './exchange-dialog.component.scss'
})
export class ExchangeDialogComponent {

  public form = this.fb.group({
    items: [],
    receiver: [null, Validators.required]
  });
  public validItems: Item[] = [];
  public characters: any[] = [];

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { selectedChar: any, characters: any[] }, private charService: CharacterService) {
    this.characters = this.data.characters;
    this.form = this.fb.group({
      items: [[], [Validators.required, this.arrayNotEmptyValidator()]],
      receiver: [null, Validators.required]
    });
    this.validItems = this.data.selectedChar.equipaggiamento.filter((item: any) => !item.weared && item.quantity > 0);
  }

  // Validatore personalizzato per verificare che l'array non sia vuoto
  private arrayNotEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { arrayNotEmpty: { valid: false } };
    };
  }

  // public exchange() {
  //   const receiver = this.form.get('receiver').value as any;
  //   if (!receiver) return;
  //   this.form.value.items.forEach((item: any) => {
  //     if (receiver.equipaggiamento.find((i: any) => i.name === item.name)) {
  //       receiver.equipaggiamento.find((i: any) => i.id === item.id).quantity += 1;
  //     } else {
  //       receiver.equipaggiamento.push({...item, quantity: 1});
  //     }
  //     this.data.selectedChar.equipaggiamento.find((i: any) => i.id === item.id).quantity -= 1;
  //   });
  //   this.charService.updateInventory(receiver.id, receiver.equipaggiamento);
  //   this.charService.updateInventory(this.data.selectedChar.id, this.data.selectedChar.equipaggiamento);
  //   // this.resetForm(); // Alla fine
  // }

  public exchange() {
    const receiver = this.form.get('receiver')?.value as any;
    if (!receiver) return;
    const items = this.form.value.items;
    if (!Array.isArray(items)) return;

    items.forEach((item: any) => {
      // Controlla se il receiver ha già l'item
      const receiverItem = receiver.equipaggiamento?.find((i: any) => i.id === item.id);
      if (receiverItem) {
        // Incrementa la quantità se l'item esiste già
        receiverItem.quantity += 1;
      } else {
        // Aggiungi l'item se non esiste
        receiver.equipaggiamento.push({ ...item, quantity: 1 });
      }

      // Trova l'item nel personaggio selezionato e decrementa la quantità
      const selectedCharItem = this.data.selectedChar.equipaggiamento?.find((i: any) => i.id === item.id);
      if (selectedCharItem) {
        selectedCharItem.quantity -= 1;
        // if (selectedCharItem.quantity === 0) {
        //   // Rimuovi l'item se la quantità è 0 (opzionale, dipende dai requisiti)
        //   const index = this.data.selectedChar.equipaggiamento.indexOf(selectedCharItem);
        //   if (index > -1) {
        //     this.data.selectedChar.equipaggiamento.splice(index, 1);
        //   }
        // }
      }
    });

    // Aggiorna l'inventario per entrambi i personaggi
    const requests = [];
    requests.push(this.charService.updateInventory(receiver.id, receiver.equipaggiamento));
    requests.push(this.charService.updateInventory(this.data.selectedChar.id, this.data.selectedChar.equipaggiamento));

    Promise.all(requests).then(() => {
      // Resetta il form alla fine, se necessario
      this.resetForm();
    });

    // this.charService.updateInventory(receiver.id, receiver.equipaggiamento).then(() => {
    //   this.charService.updateInventory(this.data.selectedChar.id, this.data.selectedChar.equipaggiamento);
    // });

    // Resetta il form alla fine, se necessario
    // this.resetForm();
  }


  public resetForm() {
    this.form.reset();
  }
}
