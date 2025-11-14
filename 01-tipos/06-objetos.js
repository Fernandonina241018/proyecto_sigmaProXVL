// 
let nombre = "Juan";
let anime = "naruto";
let edad = 30;      

let personaje = {
    nombre: "Sasuke",
    anime: "Naruto",  
    edad: 17, };

console.log("Nombre:", nombre);
console.log("Anime:", anime);
console.log("Edad:", edad);

delete personaje.edad;

console.log("Personaje:", personaje);