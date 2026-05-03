# SeedGoat v1.1

SeedGoat is a PRNG and seeding algorithm wrapper for JavaScript.
Created by ImIcterine.
Now supports non-numeric seeds.

### Currently supports:
- Mulberry32
- Xorshift32
- SFC32
- Alea

## Setting up
Put this in you HTML before your script:
```html
<script src="https://cdn.jsdelivr.net/gh/ImIcterine/seedgoat@main/seedgoat.js"></script>
```

## Creating an RNG
```javascript
const seed = 12345

const rng1 = new seedgoat.mulberry32(seed)
const rng2 = new seedgoat.xorshift32(seed)
const rng3 = new seedgoat.sfc32(seed)
const rng4 = new seedgoat.alea(seed)
```

## Generating numbers
```javascript
// Floats
const num1 = rng.nextNum(0, 10)

// Integers
const num2 = rng.nextInt(0, 10)
```