import { User } from "firebase/auth";

export class UserData {
    id: string;
    displayName: string;
    photoURL: string;
    progressive: number;
    dddiceToken: string;
    privateSlug: string;
    characters: string[];

    constructor(id: string, displayName: string, photoURL: string, progressive: number, dddiceToken: string, privateSlug: string, characters: string[]) {
        this.id = id;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.progressive = progressive;
        this.dddiceToken = dddiceToken;
        this.privateSlug = privateSlug;
        this.characters = characters;
    }

    static parseUser(user: User, userData: any): UserData {
        return new UserData(
            user.uid,
            user.displayName || "",
            user.photoURL || "",
            userData.progressive || 0,
            userData.dddiceToken || "",
            userData.privateSlug || "",
            userData.characters || []
        );
    }
}
