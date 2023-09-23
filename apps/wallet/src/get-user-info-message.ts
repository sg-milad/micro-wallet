export class GetUserInfoMessage {
    constructor(
        public id: string,
        public amount: number,
        public userId: string
    ) { }
    toString() {
        return JSON.stringify({
            id: this.id,
            amount: this.amount,
            userId: this.userId
        });
    }
}