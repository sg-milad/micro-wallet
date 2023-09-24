export class UpdateUserEvent {
    constructor(
        public readonly userId: string,
        public readonly amount: number
    ) { }
}