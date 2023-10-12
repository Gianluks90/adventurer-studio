import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-monete',
  templateUrl: './monete.component.html',
  styleUrls: ['./monete.component.scss']
})
export class MoneteComponent {
  public group: FormGroup | null = null;
  public tipiMonete: string[] = ['rame','argento','electrum','oro','platino'];
  public converter_dict:{[key: string]: number} = {
    'platino': 1000,
    'oro': 100,
    'electrum': 50,
    'argento': 10,
    'rame': 1
  }

  constructor(public formService: FormService) {}

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.group = form.get('denaro') as FormGroup;
        console.log(this.group.value);
      }
    });
  }




public converti(valore: number, da: string, a: string): number {
    return valore * this.converter_dict[da] / this.converter_dict[a];
}




public minimise_bag(valori_dict: Record<string, number>) {
    let return_dict: Record<string, number> = {};
    let min_bag = 0;
    for (let [k, v] of Object.entries(valori_dict)) {
      min_bag += this.converti(v, k, "rame");
    }
    for (let entry of Object.entries(this.converter_dict)) {
      let true_div = min_bag / entry[1];
      return_dict[entry[0]] = Math.floor(true_div);
      min_bag = min_bag % entry[1];
    }
    return return_dict;
  }

  public add_subtract(valori_dict: any, valori_dict2: any, what: string) {
    let return_dict: any = {};
    let min_bag = 0;
    let min_bag2 = 0;
    let totale = 0;
    console.log(valori_dict, valori_dict2);


    for (let [k, v] of Object.entries(valori_dict)) {
      console.log('1',k,v)
        // min_bag += this.converti(v, k, 'rame');
    }
    for (let [k, v] of Object.entries(valori_dict2)) {
      console.log('2',k,v)
        // min_bag2 += this.converti(v, k, 'rame');
    }
    if (what == 'add')
        totale = min_bag + min_bag2;
    else
        totale = min_bag - min_bag2;
    for (let entry of Object.entries(this.converter_dict)) {
        let true_div = totale / entry[1];
        return_dict[entry[0]] = Math.floor(true_div);
        totale = totale % entry[1];
    }
    return return_dict ;
}
}
