import { Socket } from "socket.io-client";
import { Ref } from "vue";

declare module '../socket' {
    export const state: {
        connected: Ref<boolean>;
        fooEvents: any[];
        barEvents: any[];
    };

    export const socket: Socket;
}
