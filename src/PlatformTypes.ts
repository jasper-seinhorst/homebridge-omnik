import { PlatformAccessory } from 'homebridge';

export interface OmnikAccessory {
    accessory: PlatformAccessory;
    displayName?: string;
    beat(powerProduction: PowerProduction): void;
}

export interface PowerProduction {
    now: number;
    today: number;
    total: number;
}

export interface OmnikDevice {
    name: string;
    firmware: string;
    serial: string;
}