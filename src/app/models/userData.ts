import { User } from "firebase/auth";

export class UserData {
    id: string;
    displayName: string;
    photoURL: string;
    progressive: number;
    campaignProgressive: number;
    dddiceToken: string;
    privateSlug: string;
    characters: string[];
    role: string

    constructor(id: string, displayName: string, photoURL: string, progressive: number, campaignProgressive: number, dddiceToken: string, privateSlug: string, characters: string[], role: string) {
        this.id = id;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.progressive = progressive;
        this.campaignProgressive = campaignProgressive;
        this.dddiceToken = dddiceToken;
        this.privateSlug = privateSlug;
        this.characters = characters;
        this.role = role
    }

    static parseUser(user: User, userData: any): UserData {
        return new UserData(
            user.uid,
            user.displayName || "",
            user.photoURL || "",
            userData.progressive || 0,
            userData.campaignProgressive || 0,
            userData.dddiceToken || "",
            userData.privateSlug || "",
            userData.characters || [],
            userData.role || ''
        );
    }
}
