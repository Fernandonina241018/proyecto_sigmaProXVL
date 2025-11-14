let user = {
    name: 'Juan',
    age: 30,
    city: 'Madrid'
};


for (let key in user) {
    console.log(`${key}: ${user[key]}`);
}   