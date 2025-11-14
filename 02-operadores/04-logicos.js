let mayor =false;
let suscrito =true; 
let catalogoInfantil = !mayor;


if (mayor && suscrito){
    console.log("Puede ver el contenido", mayor, suscrito);
}else if (catalogoInfantil && suscrito){ 
    console.log("Puede ver el contenido infantil", 'Edad:', mayor, 'Suscripción:', suscrito);
}else {
    console.log("No puede ver el contenido", 'Edad:', mayor, 'Suscripción:', suscrito);
}