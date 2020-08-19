import { Seatsio } from 'types/seatsio';

export {};

declare global {
    interface Window {

        seatsio: Seatsio;

    }
}
