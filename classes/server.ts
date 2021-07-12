
import express from 'express'
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io'
import http from 'http'
import * as socket from '../sockets/sockets';

export default class Server{

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;
    private static _instance: Server;


    constructor() { 

        this.app = express();
        this.port = SERVER_PORT;
        
        this.httpServer = new http.Server( this.app );
        this.io = require("socket.io")(this.httpServer, {
            cors:{
                origin: true,
                credentials: true
            }
        })
        this.listenSockets();
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    private listenSockets(){
        console.log('Listening connections');

        this.io.on('connection', (client) => {
            console.log('client connected')

            //Messages
            socket.message( client , this.io);

            //Disconnect
            socket.disconnect(client);
            
        } )
    }

    start( callback: any) {

        this.httpServer.listen( this.port, callback );
    }

}