import { Injectable } from '@angular/core';
import { DddiceService } from './dddice.service';

@Injectable({
  providedIn: 'root'
})
export class RollDiceService {


  constructor(private dddice: DddiceService) { }


  public async rollDice(quantity: number): Promise<any> {
    const dices: any[] = [];
    for (let i = 0; i < quantity; i++) {
      dices.push({
        theme: "dungeonscompanion2023-enemy-lp882vo8",
        type: "d6",
      });
    }

    if (this.dddice.dddice) {
      this.dddice.dddice.roll(
        dices
      ).then((result) => {
        // this.notification.dismissSnackBar();
        // this.dddice?.on(ThreeDDiceRollEvent.RollFinished, () => {
        //   const message = (result.data.values.map((value: any) => (modifier && modifier > 0) ? value.value + modifier : value.value).join(", ")) + (result.data.values.length > 1 ? " = " + result.data.total_value : "");
        //   this.notification.openSnackBar("Ottenuto: " + message, "casino");
        // });
      });
    }
  }
}
