export class UpdateUserAmountEvent {
    constructor(
        public readonly userId: string,
        public readonly amount: number
    ) { }
    toString() {
        return JSON.stringify({
            userId: this.userId,
            amount: this.amount
        });
    }
}