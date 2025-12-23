export abstract class MicroserviceModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly consumerId: string,
        public readonly clientId: string,
    ) {}
}
