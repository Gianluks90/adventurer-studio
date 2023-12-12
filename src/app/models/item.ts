export class Item {
    name: string;
    icon: string;
    filtered: boolean;
    quantity: number;
    description?: string;

    constructor(name: string, icon: string, filtered: boolean, quantity: number, description?: string) {
        this.name = name;
        this.icon = icon;
        this.filtered = filtered;
        this.quantity = quantity;
        this.description = description;
    }

    static createEmpty() {
        return new Item('', '', false, 0, '');
    }

    static create(name: string, icon: string, filtered: boolean, quantity: number, description?: string) {
        return new Item(name, icon, filtered, quantity, description);
    }

    static createFrom(item: Item) {
        return new Item(item.name, item.icon, item.filtered, item.quantity, item.description);
    }
}