export interface IEventBus {
  publish(event: any): void;
}

export const IEVENT_REPO = Symbol('IEVENT_REPO');
