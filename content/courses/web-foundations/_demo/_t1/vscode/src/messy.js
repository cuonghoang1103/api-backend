const products=[{name:"Keyboard",price:450000},{name:"Mouse",price:150000}]
function total(items){let sum=0
for(const item of items){sum+=item.price}
    return sum}
console.log( "Total:",total( products ) )
