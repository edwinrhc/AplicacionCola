// Referencias HTML
const lblEscritorio = document.querySelector('.escritorioHtml');
const btnAtender = document.querySelector('.btnAtender');
const lblTicket = document.querySelector('.textAtendiendo');
const divAlerta = document.querySelector('.alertaTickets');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if ( !searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {

    if(pendientes === 0){
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }

})


btnAtender.addEventListener( 'click', () => {

        socket.emit('atender-ticket',{escritorio}, ({ok, ticket, msg})=>{
           if(!ok){
            lblTicket.innerText = `Nadie`
            return divAlerta.style.display = '';
           }

           // si no hay erro tengo un ticket
           lblTicket.innerText = `Ticket : `+ ticket.numero;

        });
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //    lblNuevoTicket.innerText = ticket;
    // });

});