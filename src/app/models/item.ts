import { FormBuilder, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";

export class Item {
    name: string;
    icon: string;
    filtered: boolean;
    quantity: number;
    rarity: string;
    category: string;
    description?: string;
    value?: number;
    weight?: number;
    cursed?: boolean;
    cursedDescription?: string;
    magicItem?: boolean;
    artifact?: boolean;
    CA?: number;
    minStrength?: number;
    stealthDisadvantage?: boolean;
    damageFormula?: string;
    damageType?: string;
    weaponProperties?: string[];
    traits?: Trait[];
    attunementRequired?: boolean;
    attuned?: boolean;
    artifactProperties?: Trait[];
    reference?: string;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: number, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: Trait[], reference?: string, magicItem?: boolean, artifact?: boolean, CA?: number, minStrength?: number, stealthDisadvantage?: boolean, damageFormula?: string, damageType?: string, weaponProperties?: string[]) {
        this.name = name;
        this.icon = icon;
        this.filtered = filtered;
        this.quantity = quantity;
        this.rarity = rarity;
        this.category = category;
        this.description = description;
        this.value = value;
        this.weight = weight;
        this.cursed = cursed;
        this.cursedDescription = cursedDescription;
        this.traits = traits;
        this.attunementRequired = attunementRequired;
        this.attuned = attuned;
        this.artifactProperties = artifactProperties;
        this.reference = reference;
        this.magicItem = magicItem;
        this.artifact = artifact;
        this.CA = CA;
        this.minStrength = minStrength;
        this.stealthDisadvantage = stealthDisadvantage;
        this.damageFormula = damageFormula;
        this.damageType = damageType;
        this.weaponProperties = weaponProperties;
    }

    static create(builder: FormBuilder) {
        return {
            name: ['', Validators.required],
            icon: ['', Validators.required],
            filtered: false,
            quantity: [1, [Validators.required, Validators.min(1)]],
            rarity: ['', Validators.required],
            category: ['', Validators.required],
            description: '',
            value: 0,
            weight: 0,
            cursed: false,
            cursedDescription: '',
            traits: builder.array([]),
            attunementRequired: false,
            attuned: false,
            artifactProperties: builder.array([]),
            reference: '',
            magicItem: false,
            artifact: false,
            CA: 0,
            minStrength: 0,
            stealthDisadvantage: false,
            damageFormula: '',
            damageType: '',
            weaponProperties: []
        }
    }

}

export class Trait {
    title: string;
    description: string;

    static create(builder: FormBuilder) {
        return {
            title: ['', Validators.required],
            description: ['', Validators.required],
        }

    }
}

// export class Armor extends Item {
//     CA: number;
//     stelthDisadvantage: boolean;

//     constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, CA?: number, stelthDisadvantage?: boolean) {
//         super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
//         this.CA = CA;
//         this.stelthDisadvantage = stelthDisadvantage;
//     }
// }

// export class Weapon extends Item {
//     damageFormula: string;
//     damageType: string;
//     weaponProperties: string[];

//     constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, damageFormula?: string, damageType?: string, weaponProperties?: string[]) {
//         super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
//         this.damageFormula = damageFormula;
//         this.damageType = damageType;
//         this.weaponProperties = weaponProperties;
//     }
// }