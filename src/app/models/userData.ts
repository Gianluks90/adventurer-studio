import { User } from "firebase/auth";

export class UserData {
    id: string;
    name: string;
    surname: string;
    photoURL: string;

    constructor(id: string, name: string, surname: string, photoURL: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.photoURL = photoURL;
    }

    static parseUser(user: User, userData: any): UserData {
        console.log(user, userData);
        
        return new UserData(user.uid, userData.displayName, userData.surname, userData.photoURL);
    }
}