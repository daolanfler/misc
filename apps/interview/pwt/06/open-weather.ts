/* eslint-disable @typescript-eslint/no-var-requires */
function greet(): void {
    const readlineSync = require("readline-sync");
    const name: string = readlineSync.question("what is your name? ");
    console.log(`Hi ${name};`);
}

function weahter(): void {
    const open = require('open');
    open('https://www.weather.com');
}
greet();
weahter();
