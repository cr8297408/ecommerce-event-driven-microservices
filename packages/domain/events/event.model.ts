import { Topics } from "../topics";

export abstract class EventModel {
  constructor(
    public readonly topic: Topics,
    public readonly data: any,
  ) {}
}