export class Chapter {
    id: string = '';
    title: string = '';
    subtitle: string = '';
    description: string = '';
    bookmarked: boolean = false;
    elements: any[] = [];

    constructor() {}

    static parseData(data: any): Chapter {
        const chapter = new Chapter();
        chapter.id = data.id || '';
        chapter.title = data.title || '';
        chapter.description = data.description || '';
        chapter.bookmarked = data.bookmarked || false;
        chapter.elements = data.elements || [];
        return chapter;
    }
}