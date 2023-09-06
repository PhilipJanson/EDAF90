'use strict';

/**
 * Reflection question 1
 * A non-declared property in JS equals 'undefined' which is a falsy value.
 * When evaluting a falsy value e.g. !undefined, it is considered false.
 */

import inventory from './inventory.mjs';
import { v4 as uuidv4 } from 'uuid';

console.log('\n=== beginning of printout ================================')
console.log('inventory:', inventory);

console.log('\n--- Object.keys() ---------------------------------------')
const names = Object.keys(inventory);
names
  .sort((a, b) => a.localeCompare(b, "sv", { sensitivity: 'case' }))
  .forEach(name => console.log(name));

console.log('\n--- for ... in ---------------------------------------')
for (const name in inventory) {
  console.log(name);
}
/**
 * Reflection question 2
 * When using a for loop, properties which are enumberable (own) and enumerable (inherited)
 * will both be traversed, however, when using forEach on keys, entries or values, only
 * properties which are enumerable (own) will be traversed.
 */

console.log('\n--- Assignment 1 ---------------------------------------')

function makeOptions(inv, prop) {
  const res = Object.keys(inv)
    .filter(a => inv[a][prop])
    .map(a => `<option value="${a}" key="${a}"> ${a}, ${inv[a].price}</option>\n`)
    .reduce((a, b) => a + b);
  return res;
}

console.log(makeOptions(inventory, 'foundation'));

console.log('\n--- Assignment 2 ---------------------------------------')
class Salad {
  static instanceCounter = 0;

  constructor(copy) {
    if (copy){
      this.ingredients = {
        ...copy.ingredients
      }
    } else {
      this.ingredients = {};
    }

    this.id = 'salad_' + Salad.instanceCounter++;
    this.uuid = uuidv4();
  }

  static parse(json) {
      const data = JSON.parse(json);

      if (Array.isArray(data)){
        return data.map(a => new Salad(a));
      }

      return new Salad(data);
  }
}

Salad.prototype.add = function(name, properties) {
  this.ingredients[name] = properties;
  return this;
}

Salad.prototype.remove = function(name) {
  delete this.ingredients[name]
  return this;
}

let myCaesarSalad = new Salad()
  .add('Sallad', inventory['Sallad'])
  .add('Kycklingfilé', inventory['Kycklingfilé'])
  .add('Bacon', inventory['Bacon'])
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'])
  .add('Ceasardressing', inventory['Ceasardressing'])
  .add('Gurka', inventory['Gurka']);
console.log(JSON.stringify(myCaesarSalad) + '\n');
myCaesarSalad.remove('Gurka');
console.log(JSON.stringify(myCaesarSalad) + '\n');

console.log('\n--- Assignment 3 ---------------------------------------')

Salad.prototype.getPrice = function() {
  return Object.values(this.ingredients)
    .map(a => parseFloat(a.price))
    .reduce((a, b) => a + b)
}

Salad.prototype.count = function(prop) {
  return Object.values(this.ingredients)
    .filter(a => a[prop]).length
}

console.log('En ceasarsallad kostar ' + myCaesarSalad.getPrice() + 'kr');
// En ceasarsallad kostar 45kr
console.log('En ceasarsallad har ' + myCaesarSalad.count('lactose') + ' ingredienser med laktos');
// En ceasarsallad har 2 ingredienser med laktos
console.log('En ceasarsallad har ' + myCaesarSalad.count('extra') + ' tillbehör');
// En ceasarsallad har 3 tillbehör


console.log('\n--- reflection question 3 ---------------------------------------')
console.log('typeof Salad: ' + typeof Salad);
console.log('typeof Salad.prototype: ' + typeof Salad.prototype);
console.log('typeof Salad.prototype.prototype: ' + typeof Salad.prototype.prototype);
console.log('typeof myCaesarSalad: ' + typeof myCaesarSalad);
console.log('typeof myCaesarSalad.prototype: ' + typeof myCaesarSalad.prototype);
console.log('check 1: ' + (Salad.prototype === Object.getPrototypeOf(Salad)));
console.log('check 2: ' + (Salad.prototype === Object.getPrototypeOf(myCaesarSalad)));
console.log('check 3: ' + (Object.prototype === Object.getPrototypeOf(Salad.prototype)));

console.log('\n--- Assignment 4 ---------------------------------------')

const singleText = JSON.stringify(myCaesarSalad);
const arrayText = JSON.stringify([myCaesarSalad, myCaesarSalad]);

const objectCopy = new Salad(myCaesarSalad);
const singleCopy = Salad.parse(singleText);
const arrayCopy = Salad.parse(arrayText);

console.log('original myCaesarSalad\n' + JSON.stringify(myCaesarSalad));
console.log('new(myCaesarSalad)\n' + JSON.stringify(objectCopy));
console.log('Salad.parse(singleText)\n' + JSON.stringify(singleCopy));
console.log('Salad.parse(arrayText)\n' + JSON.stringify(arrayCopy));

singleCopy.add('Gurka', inventory['Gurka']);
console.log('originalet kostar ' + myCaesarSalad.getPrice() + ' kr');
console.log('kopian med gurka kostar ' + singleCopy.getPrice() + ' kr');

console.log('\n--- Assignment 5 ---------------------------------------')

class GourmetSalad extends Salad {
}

GourmetSalad.prototype.add = function(name, properties, size) {
  let sizedProp = {...properties};

  if (!size){
    size = 1;
  }

  if (this.ingredients[name]) {
    const old = this.ingredients[name].size;
    sizedProp.size = old + size;
  }
  else {
    sizedProp.size = size;
  }

  return Salad.prototype.add.call(this, name, sizedProp);
}

GourmetSalad.prototype.getPrice = function() {
  return Object.values(this.ingredients)
    .map(a => parseFloat(a.price) * parseFloat(a.size))
    .reduce((a, b) => a + b)
}

let myGourmetSalad = new GourmetSalad()
  .add('Sallad', inventory['Sallad'], 0.5)
  .add('Kycklingfilé', inventory['Kycklingfilé'], 2)
  .add('Bacon', inventory['Bacon'], 0.5)
  .add('Krutonger', inventory['Krutonger'])
  .add('Parmesan', inventory['Parmesan'], 2)
  .add('Ceasardressing', inventory['Ceasardressing']);
console.log('Min gourmetsallad med lite bacon kostar ' + myGourmetSalad.getPrice() + ' kr');
myGourmetSalad.add('Bacon', inventory['Bacon'], 1)
console.log('Med extra bacon kostar den ' + myGourmetSalad.getPrice() + ' kr');

console.log('\n--- Assignment 6 ---------------------------------------')

console.log('Min gourmetsallad har id: ' + myGourmetSalad.id);
console.log('Min gourmetsallad har uuid: ' + myGourmetSalad.uuid);


/**
 * Reflection question 4
 * In the super object. 
 */
/**
 * Reflection question 5
 * Yes, here is an example:
 */
Object.defineProperty(myGourmetSalad, 'testid', {value: 123})
// myGourmetSalad.testid = 321 //Not allowed
console.log(myGourmetSalad.testid)
/**
 * Reflection question 6
 * Yes, by adding a # before a property name.
 */
