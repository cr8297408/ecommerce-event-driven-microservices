import { Topics } from "../topics";

export abstract class EventModel<T> {
  constructor(
    public readonly topic: Topics,
    public readonly data: T,
  ) {}
}