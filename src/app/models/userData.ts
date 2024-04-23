import { User } from "firebase/auth";

export class UserData {
    id: string = '';
    displayName: string = '';
    photoURL: string = '';
    progressive: number = 0;
    campaignProgressive: number = 0;
    dddiceToken: string = '';
    privateSlug: string = '';
    characters: string[] = [];
    role: string = '';
    favoriteCharacter: string = '';


    constructor() {}

    static parseUser(user: User, userData: any): UserData {
        const data = new UserData();
        data.id = user.uid;
        data.displayName = user.displayName!;
        data.photoURL = user.photoURL!;
        data.progressive = userData.progressive;
        data.campaignProgressive = userData.campaignProgressive;
        data.dddiceToken = userData.dddiceToken;
        data.privateSlug = userData.privateSlug;
        data.characters = userData.characters;
        data.role = userData.role;
        data.favoriteCharacter = userData.favoriteCharacter;
        return data;
    }
}
