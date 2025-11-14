let menu = {'1 - Bebidas': 'Bebidas', '2 - Comida': 'Comida', '3 - Postres': 'Postres'};
let i = 1;

while(i < 11){
    if (i % 2 === 0) {
        console.log('El numero es par:',i);
        i++;
        continue;
    }else if(i % 2 !== 0){
        console.log('El numero es impar:',i);
        i++;
        continue;   
    }
    i++;
    console.log('El numero es el:',i);
    
}