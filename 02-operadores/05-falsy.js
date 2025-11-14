let nombre = '';
let userName = nombre || "Invitado";

function fn1() {
    console.log('Función fn1 ejecutada');
    return true;
}

function fn2() {
    console.log('Función fn2 ejecutada');
    return true;
}


let x = fn1() && fn2();