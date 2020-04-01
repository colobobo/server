import { RoomInterface } from '@/types/index';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      rooms: Map<string, RoomInterface>;
    }
  }
}
