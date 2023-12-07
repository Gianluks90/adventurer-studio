export class Item {
    name: string;
    icon: string;
    filtered: boolean;
    
    constructor(name: string, icon: string, filtered: boolean) {
        this.name = name;
        this.icon = icon;
        this.filtered = filtered;
    }
}