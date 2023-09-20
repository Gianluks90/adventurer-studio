import { User } from "firebase/auth";

export class UserData {
    id: string;
    displayName: string;
    photoURL: string;
    characters: string[] = [];

    constructor(id: string, displayName: string, photoURL: string, characters?: string[]) {
        this.id = id;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.characters = characters || [];
    }

    static parseUser(user: User, userData: any): UserData {
        console.log(user, userData);
        
        return new UserData(user.uid, user.displayName || '', user.photoURL || '', userData.characters);
        }
}