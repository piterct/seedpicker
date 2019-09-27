let expect = require("chai").expect;
let assert = require("chai").assert;
let seedpicker = require("./seedpicker.js")

describe("Calculate the 24th word", function () {
    it("should calculate all checksum words", () => {
        const my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const words = seedpicker.allLastWords(my23words);
        expect(words).to.have.lengthOf(8);

        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(words).to.have.members(expectedWords);
    })

    it("should handle mixed casing", () => {
        const my23words = "Empower soul reuNion entire help raiSe truth reflect arguE transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const words = seedpicker.allLastWords(my23words);
        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(words).to.have.members(expectedWords);
    })

    it("should select a random checksum word", () => {
        const my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const lastWord = seedpicker.randomLastWord(my23words);

        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(lastWord).to.be.oneOf(expectedWords);
    })
    it('should have an empty error message if supplied words are valid', function () {
        const result = seedpicker.validate("empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december");
        expect(result.errorMessage).to.be.empty
        expect(result.valid).to.be.true
    });
    it('should not be valid if the number of words are not exactly 11 or 23', function () {
        const result = seedpicker.validate("empower soul reunion")
        expect(result.errorMessage).to.include("11 or 23")
        expect(result.valid).to.be.false
    });
    it('should check the words against the dictionary', function () {
        const result = seedpicker.validate("mpower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge decembe");
        expect(result.errorMessage).to.include("mpower")
        expect(result.errorMessage).to.include("decembe")
        expect(result.valid).to.be.false
    });
    it('should ignore whitespaces', function () {
        const result = seedpicker.validate("     empower  soul    reunion  entire  help raise      truth reflect    argue transfer chicken  ")
        expect(result.errorMessage).to.be.empty
        expect(result.valid).to.be.true
    });
})

describe("XPUB generation according to https://github.com/iancoleman/bip39/issues/351", function () {
    it('can generate a BIP32 xpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        let derivationPath = "m/48'/1'/0'/2'";
        const result = seedpicker.xpubFromMnemonic(mnemonic, derivationPath);
        assert.strictEqual(result.xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');
    });


    it('can generate xpub in other formats', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        let derivationPath = "m/48'/0'/0'/2'";
        const result = seedpicker.xpubFromMnemonic(mnemonic, derivationPath);
        assert.strictEqual(result.xpub, 'xpub6Do9J2BK1ZPtKkc71z1ohMH2N26eRa6yZu65hEijtk1F8LX3yjdNWTBv6p1yVgqE3RnVoesvFDnbTYkD1rbJo3opse5P75jELRJcR9ev9rU');

        //Zpub -  bitcoin mainnet P2WSH
        assert.strictEqual(result.Zpub, 'Zpub74Mm2bFast3DSv9idN42wboqRkRoXAmZiPnCBHn42XbQriiRFTLmqhN7wvtd3wMy6B66BC5A3ktCMHb6kUaHY1HhSnadgJqCmbhmnAQispN');

        //Vpub - bitcoin testnet P2WSH
        assert.strictEqual(result.Vpub, 'Vpub5m2hovZvH9sJ3jPFHvuY7FRpjsr1kgoa3whK3iCWWW5teKTWEpgXMSjZs74H4JkHTccsBHgvD7Tzp98qsgvEM4ZHyRnwLfZFghTCDsjhCfc');
    });


    it('can generate Testnet Vpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        let derivationPath = "m/48'/1'/0'/2'";
        const result = seedpicker.xpubFromMnemonic(mnemonic, derivationPath);
        assert.strictEqual(result.xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');

        //Vpub - bitcoin testnet P2WSH
        assert.strictEqual(result.Vpub, 'Vpub5mJeTpJNj5U7kMZac5nVMet8VogqSwP6W59VEW2a1JDp4gtCFVR8tWVjGwTx7LJos8jFf8DzJR166aAK2Fy3Y1a6XU86VEpGC4Y2CjogHVw');
    });

})
