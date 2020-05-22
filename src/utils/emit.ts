import { payloads } from '@colobobo/library';

export const emitCallback = <T>(data: T[keyof T]): payloads.PayloadSocket<T[keyof T]> => {
  return { data };
};

export const emitErrorCallback = <T>(code: number, message: string): payloads.PayloadSocketError<T[keyof T]> => ({
  code,
  message,
  data: null,
});

export const emitGlobal = <T>({
  roomId,
  eventName,
  data,
}: {
  roomId: string;
  eventName: string;
  data?: T[keyof T];
}) => {
  global.io.in(roomId).emit(eventName, emitCallback<T>(data));
};

export const emitErrorGlobal = <T>({
  roomId,
  eventName,
  code,
  message,
}: {
  roomId: string;
  eventName: string;
  code: number;
  message: string;
}) => {
  global.io.in(roomId).emit(eventName, emitErrorCallback<T>(code, message));
};
