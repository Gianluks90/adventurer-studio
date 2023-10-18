import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-monete',
  templateUrl: './monete.component.html',
  styleUrls: ['./monete.component.scss'],
})
export class MoneteComponent {
  public group: FormGroup | null = null;
  public tipiMonete: string[] = [
    'rame',
    'argento',
    'electrum',
    'oro',
    'platino',
  ];

  public converter_dict: { [key: string]: number } = {
    MP: 1000,
    MO: 100,
    ME: 50,
    MA: 10,
    MR: 1,
  };
  public modelTipoMonete: string = '';
  public modelNumeroMonete: number = 0;

  constructor(public formService: FormService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('denaro') as FormGroup;
      }
    });
  }

  public converti(valore: number, da: string, a: string): number {
    return (valore * this.converter_dict[da]) / this.converter_dict[a];
  }

  public minimise_bag(valori_dict: { [key: string]: number }) {
    let return_dict = {};
    let min_bag = 0;
    for (let [k, v] of Object.entries(valori_dict)) {
      min_bag += this.converti(v, k, 'rame');
    }
    for (let entry of Object.entries(this.converter_dict)) {
      const true_div = min_bag / entry[1];
      return_dict[entry[0]] = Math.floor(true_div);
      min_bag = min_bag % entry[1];
    }
    return return_dict;
  }

  public add_subtract(valori_dict: string, valori_dict2: number, what: string) {
    let return_dict = {};
    let min_bag = 0;
    let min_bag2 = 0;
    let totale = 0;
    let taglioMoneta = this.cambioTaglio(valori_dict);
    let start_bag: { [key: string]: number } = this.group.value;

    for (let [k, v] of Object.entries(start_bag)) {
      if (v > 0) {
        min_bag += this.converti(v, k, 'MR');
      }
    }
    for (let [k, v] of Object.entries({ [taglioMoneta]: valori_dict2 })) {
      min_bag2 += this.converti(v, k, 'MR');
    }
    if (what == 'add') {
      totale = min_bag + min_bag2;
    } else {
      totale = min_bag - min_bag2;
    }

    for (let entry of Object.entries(this.converter_dict)) {
      const true_div = totale / entry[1];
      return_dict[entry[0]] = Math.floor(true_div);
      totale = totale % entry[1];
    }
    this.addToPreviousBag(return_dict);
    return return_dict;
  }

  public addToPreviousBag(bagToAdd: any) {
    if (bagToAdd.MP >= 0 && bagToAdd.MO >= 0 && bagToAdd.ME >= 0 && bagToAdd.MA >= 0 && bagToAdd.MR >= 0) {
    this.group.get('MP').patchValue(bagToAdd.MP);
    this.group.get('MO').patchValue(bagToAdd.MO);
    this.group.get('ME').patchValue(bagToAdd.ME);
    this.group.get('MA').patchValue(bagToAdd.MA);
    this.group.get('MR').patchValue(bagToAdd.MR);
    } else {
      this.notificationService.openSnackBar("non puoi perche' non hai abbastanza monete", 'toll', 6000)
    }

  }

  public cambioTaglio(taglio): string{
    switch (taglio) {
      case 'platino':
        return 'MP';
        case 'oro':

        return 'MO';
        case 'electrum':

        return 'ME';
        case 'argento':

        return 'MA';
        case 'rame':

        return 'MR';
      default:
        return '';
    }
  }
}
