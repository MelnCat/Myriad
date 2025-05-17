outer:
for (let k = 1; k < 32; k++){
let NUM=k
let list=[[]]
let out=[]
while(list.length){
	let last=list.pop();
if (last.length === NUM) {
out.push(last)
    if (out.length > 4) continue outer;
continue;
    
}
for(let i = 1; i <= NUM; i++) {
if (last.includes(i)) continue;
if (last.length > 0 && Math.sqrt(last.at(-1) + i)%1) continue;

const added = last.concat(i)
list.push(added)
}
//console.log(list.length)
}
console.log(k);
console.log(out.map(x => `\t${x?.join(" ")}`).join("\n"));
}