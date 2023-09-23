export class GetUserInfo {
    constructor(
        public id: string,
    ) { }
    toString() {
        return JSON.stringify({
            id: this.id
        });
    }
}