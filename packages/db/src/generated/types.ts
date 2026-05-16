import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Event = {
    id: string;
    name: string;
    date: Timestamp;
    description: string;
};
export type Session = {
    id: string;
    title: string;
    eventId: string;
};
export type User = {
    id: string;
    email: string;
    role: string;
};
export type DB = {
    Event: Event;
    Session: Session;
    User: User;
};
