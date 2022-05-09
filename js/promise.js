// 当期约进入落定状态时，与该状态相关的处理程序仅仅会被排期，而非立即执行。

function onResolved(id) { 
 setTimeout(console.log, 0, id, 'resolved'); 
} 
function onRejected(id) { 
 setTimeout(console.log, 0, id, 'rejected'); 
} 

let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000)); 
let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000)); 

p1.then(() => onResolved('p1'), 
 () => onRejected('p1')); 
p2.then(() => onResolved('p2'), 
 () => onRejected('p2')); 

 console.log("promise end!");