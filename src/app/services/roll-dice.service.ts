import { Injectable } from '@angular/core';
import { DddiceService } from './dddice.service';
import { NotificationService } from './notification.service';
import { ThreeDDiceRollEvent } from 'dddice-js';

@Injectable({
  providedIn: 'root'
})
export class RollDiceService {

  constructor(private dddice: DddiceService, private notification: NotificationService) { }

  // public async rollDice(dices: string[]): Promise<any> {
  //   const DDDICE = this.dddice.dddice;
  //   if (DDDICE) {
  //     DDDICE.roll(
  //       dices.map((dice) => {
  //         return {
  //           theme: "dddice-red",
  //           type: dice,
  //         }
  //       })
  //     ).then((result) => {
  //       // this.notification.dismissSnackBar();
  //       DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
  //         const message = (result.data.values.map((value: any) => value.value).join(", ")) + (result.data.values.length > 1 ? " = " + result.data.total_value : "");
  //         this.notification.openSnackBar("Ottenuto: " + message, "casino");
  //       });
  //     });
  //   }
  // }

  public async rollDice(dices: string[], modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        dices.map((dice) => {
          return {
            theme: "dddice-red",
            type: dice,
          }
        })
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const message = (result.data.values.map((value: any) => (modifier) ? value.value + modifier : value.value).join(", ")) + (result.data.values.length > 1 ? " = " + result.data.total_value : "");
          this.notification.openSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollSpecificDice(dice: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: "dddice-red",
          type: dice,
        }]
      ).then((result) => {
        // this.notification.dismissSnackBar();
        DDDICE.on(ThreeDDiceRollEvent.RollFinished, () => {
          const message = (result.data.values.map((value: any) => (modifier && modifier > 0) ? value.value + modifier : value.value).join(", ")) + (result.data.values.length > 1 ? " = " + result.data.total_value : "");
          this.notification.openSnackBar("Ottenuto: " + message, "casino");
        });
      });
    }
  }

  public async rollAdvantageDisadvantage(mode: string, modifier?: number): Promise<any> {
    const DDDICE = this.dddice.dddice;
    if (DDDICE) {
      DDDICE.roll(
        [{
          theme: "dddice-red",
          type: "d20", 
        },
        {
          theme: "dddice-red",
          type: "d20", 
        }
      ]).then((result) => {
        if (mode === "advantage") {
          
        } else {

        }
      });
    }
  }


}
