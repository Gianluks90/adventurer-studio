import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item, Trait } from 'src/app/models/item';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.scss'
})
export class AddItemDialogComponent {

  public form: FormGroup = this.fb.group(Item.create(this.fb));
  public selectIcons: any[] = [];
  public weaponProperties: any[] = [];
  public type: string = '';
  public traits: FormArray;
  public artifactProperties: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {inventory: Item[]}, private dialogRef: MatDialogRef<AddItemDialogComponent>, private fb: FormBuilder, private httpClient: HttpClient){
    this.traits = this.fb.array([]);
    this.artifactProperties = this.fb.array([]);
  }

  ngOnInit(){
    this.httpClient.get('./assets/settings/selectIcons.json').subscribe((data: any[]) => {
      this.selectIcons = data;
    });
    this.httpClient.get('./assets/settings/weaponProperties.json').subscribe((data: any[]) => {
      this.weaponProperties = data;
    });
    this.traits = this.form.controls['traits'] as FormArray;
    this.artifactProperties = this.form.controls['artifactProperties'] as FormArray;
  }

  confirm() {
    this.dialogRef.close({
      status: 'success',
      item: this.form.value
    })
  }

  setType(event: any) {
    this.type = event.value;
  }

  addTrait() {
    const trait = this.fb.group(Trait.create(this.fb));
    this.traits.push(trait);
  }

  deleteTrait(index: number) {
    this.traits.removeAt(index);
  }

  addProp() {
    const prop = this.fb.group(Trait.create(this.fb));
    this.artifactProperties.push(prop);
  }

  deleteProp(index: number) {
    this.artifactProperties.removeAt(index);
  }


}
