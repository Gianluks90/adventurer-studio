import { User } from "firebase/auth";

export class UserData {
    id: string;
    displayName: string;
    photoURL: string;
    progressive: number;
    characters: string[];

    constructor(id: string, displayName: string, photoURL: string, progressive: number, characters: string[]) {
        this.id = id;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.progressive = progressive;
        this.characters = characters;
    }

    static parseUser(user: User, userData: any): UserData {
        return new UserData(user.uid, user.displayName || '', user.photoURL || '', userData.progressive || 0, userData.characters || []);
    }
}
