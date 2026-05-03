// string to hash with xmur32
function normalizeSeed(seed) {
    if (typeof seed === "number" && Number.isFinite(seed)) {
        return seed >>> 0
    }
    
    const str = String(seed)
    
    let h = 1779033703 ^ str.length
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
        h = (h << 13) | (h >>> 19)
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
}

// mulberry32
class mulberry32 {
    constructor(seed) {
        this._state = normalizeSeed(seed)
    }

    _next() {
        this._state += 0x6D2B79F5

        let t = this._state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    nextNum(min, max) {
        const r = this._next()

        if (min === undefined) return r
        if (max === undefined) {
            return r * min
        }

        return r * (max - min) + min
    }

    nextInt(min, max) {
        return Math.floor(this._next() * (max - min + 1)) + min
    }
}

// xorshift32
class xorshift32 {
    constructor(seed) {
        this._state = normalizeSeed(seed)
    }

    _next() {
        let x = this._state

        x ^= x << 13
        x ^= x >>> 17
        x ^= x << 5

        this._state = x >>> 0

        return this._state / 4294967296
    }

    nextNum(min, max) {
        const r = this._next()

        if (min === undefined) return r
        if (max === undefined) return r * min

        return r * (max - min) + min
    }

    nextInt(min, max) {
        return Math.floor(this._next() * (max - min + 1)) + min
    }
}

// SFC32
class sfc32 {
    constructor(seed) {
        let h = normalizeSeed(seed)
        
        const nextSeed = () => {
            h += 0x9E3779B9
            let t = h
            t = Math.imul(t ^ (t >>> 16), 0x85EBCA6B)
            t = Math.imul(t ^ (t >>> 13), 0xC2B2AE35)
            return (t ^ (t >>> 16)) >>> 0
        }
        this.a = nextSeed()
        this.b = nextSeed()
        this.c = nextSeed()
        this.d = nextSeed()
    }

    _next() {
        this.a >>>= 0
        this.b >>>= 0
        this.c >>>= 0
        this.d >>>= 0

        let t = (this.a + this.b) | 0

        this.a = this.b ^ (this.b >>> 9)
        this.b = (this.c + (this.c << 3)) | 0
        this.c = (this.c << 21) | (this.c >>> 11)
        this.d = (this.d + 1) | 0

        t = (t + this.d) | 0
        this.c = (this.c + t) | 0

        return (t >>> 0) / 4294967296
    }

    nextNum(min, max) {
        const r = this._next()

        if (min === undefined) return r
        if (max === undefined) return r * min

        return r * (max - min) + min
    }

    nextInt(min, max) {
        return Math.floor(this._next() * (max - min + 1)) + min
    }
}

//Alea
class alea {
    constructor(seed) {
        this._mash = this._createMash()

        this.s0 = this._mash(' ')
        this.s1 = this._mash(' ')
        this.s2 = this._mash(' ')
        this.c = 1

        this.s0 -= this._mash(seed)
        if (this.s0 < 0) this.s0 += 1

        this.s1 -= this._mash(seed)
        if (this.s1 < 0) this.s1 += 1

        this.s2 -= this._mash(seed)
        if (this.s2 < 0) this.s2 += 1
    }

    _createMash() {
        let n = 0xefc8249d

        return function (data) {
            data = data.toString()

            for (let i = 0; i < data.length; i++) {
                n += data.charCodeAt(i)
                let h = 0.02519603282416938 * n
                n = h >>> 0
                h -= n
                h *= n
                n = h >>> 0
                h -= n
                n += h * 4294967296
            }

            return (n >>> 0) / 4294967296
        }
    }

    _next() {
        let t = 2091639 * this.s0 + this.c / 4294967296

        this.s0 = this.s1
        this.s1 = this.s2
        this.s2 = t - (this.c = t | 0)

        return this.s2
    }

    nextNum(min, max) {
        const r = this._next()

        if (min === undefined) return r
        if (max === undefined) return r * min

        return r * (max - min) + min
    }

    nextInt(min, max) {
        return Math.floor(this._next() * (max - min + 1)) + min
    }
}

window.seedgoat = {
    mulberry32,
    xorshift32,
    sfc32,
    alea
}