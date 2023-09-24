export class GetUserAmount {
    constructor(
        public amount: number,
    ) { }
    toString() {
        return JSON.stringify({
            amount: this.amount,
        });
    }
}