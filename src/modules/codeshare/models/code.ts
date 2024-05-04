export class Code{
    code:string;
    created:Date|undefined;
    modified:Date|undefined;
    constructor(code:string,created:Date|undefined,modified:Date|undefined){
        this.code=code;
        this.created=created;
        this.modified=modified;
    }
}
