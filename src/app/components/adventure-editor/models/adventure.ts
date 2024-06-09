import { Chapter } from "./chapter";

export class Adventure {
    id: string = '';
    title: string = '';
    chapters: Chapter[] = [];
    status: any = {
        createdAt: new Date(),
        lastUpdate: new Date(),
        statusMessage: '',
        author: ''
    };

    constructor() {}

    public static parseData(data: any): Adventure {
        const adventure = new Adventure();
        adventure.id = data.id || '';
        adventure.title = data.title || '';
        adventure.status = data.status || {};
        adventure.chapters = data.chapters || [];
        return adventure;
    }

}