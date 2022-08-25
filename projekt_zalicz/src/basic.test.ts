
function sum(a, b){
    return a + b
}


test("jest works correctly",()=>{
    expect(sum(1,2)).toBe(3)
})