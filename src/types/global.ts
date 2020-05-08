import { RoomInterface } from '@/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      rooms: Map<string, RoomInterface>;
      // TODO: Add type
      io: any;
    }
  }
}
