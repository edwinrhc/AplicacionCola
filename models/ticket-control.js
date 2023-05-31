const path = require('path');
const fs = require('fs');


class Ticket {
    constructor( numero, escritorio){
        this.numero = numero;
        this.escritorio= escritorio;
    }
}

class TicketControl {

    constructor(){
        this.ultimo     = 0; // último ticket 
        this.hoy        = new Date().getDate();  // día de hoy
        this.tickets    =  [];
        this.ultimos4   =  [];

        this.init();
    }

    get toJson(){
        return {
        ultimo:     this.ultimo,
        hoy:        this.hoy,
        tickets:    this.tickets,
        ultimos4:   this.ultimos4

        }
        }
   
        init(){
            // tenemos que leer el archivo json
            const { hoy, tickets, ultimos4, ultimo} = require('../db/data.json');
                if(hoy === this.hoy){
                    this.tickets = tickets;
                    this.ultimo = ultimo;
                    this.ultimos4 = ultimos4
                }else{
                    // es Otro día
                    this.guardarDB();
                }

        }

        guardarDB(){

            const dbPath = path.join(__dirname, '../db/data.json');
            fs.writeFileSync( dbPath, JSON.stringify( this.toJson))

        }
   
        siguiente(){
            this.ultimo += 1; // igual y suma 1
            const ticket = new Ticket(this.ultimo, null);
            this.tickets.push( ticket);

            this.guardarDB();
            return 'Ticket ' + ticket.numero;
        }


        atenderTicket( escritorio){

            // No tenemos tickets
            if( this.tickets.length === 0 ){
                return null;
            }

            const ticket = this.tickets.shift(); //  this.tickets[0];
            ticket.escritorio = escritorio;
            
            this.ultimos4.unshift(ticket); // añade un elemento nuevo de arreglo pero al inicio

            if(this.ultimos4.length > 4){
                this.ultimos4.splice(-1,1); // aqui borra tmb
            }

            this.guardarDB();

            return ticket;


        }


   

    }


    module.exports = TicketControl;
