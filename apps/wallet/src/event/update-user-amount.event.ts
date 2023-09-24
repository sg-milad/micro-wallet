export class UpdateUserAmountEvent {
    constructor(
        public readonly userId: string,
        public readonly amount: number
    ) { }
}