const { expect } = require("@jest/globals");

describe("Methods", ()=>{
    it("runs", ()=>{
        var suc ;
        try{
            require("../strategy-playes") ;
            suc = true;
        } catch(e){
            suc = false ;
        }
        expect(suc).toBe(true) ;
    });
    it("lateral choice when free", ()=>{
        let strategy = require("../strategy-playes") ;
        var play = strategy.lateralLivre([1,null,null,null,null,null,null,null,null], 1) ;
        expect((play ==2 || play == 6)).toBe(true) ;
    });
    it("lateral choice when not free", ()=>{
        let strategy = require("../strategy-playes") ;
        var play = strategy.lateralLivre([1,2,null,null,null,null,null,null,null], 1) ;
        expect((play)).toBe(6) ;
    });
    it("lateral choice is imposible", ()=>{
        let strategy = require("../strategy-playes") ;
        var play = strategy.lateralLivre([1,2,null,2,null,null,null,null,null], 1) ;
        expect((play)).toBe(null) ;
    });
})