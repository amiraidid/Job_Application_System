/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventBus } from 'src/domain/services/event-bus.intetface';

@Injectable()
export class NestEventBus implements IEventBus {
  constructor(private readonly emitter: EventEmitter2) {}

  publish(event: any): void {
    this.emitter.emit(event.constructor.name, event);
  }
}
