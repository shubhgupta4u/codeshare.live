export class Code {
    code: string;
    created: string | undefined;
    modified: string | undefined;
    writeAccessCode: string | undefined;
    constructor(code: string, created: Date | undefined, modified: Date | undefined) {
        this.code = code;
        if (created && created instanceof Date) {
            this.created = JSON.stringify(created);
        }
        if (modified && modified instanceof Date) {
            this.modified = JSON.stringify(modified);
        }

    }
}
