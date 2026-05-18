const fs = require("fs");
const h = fs.readFileSync("indexx.html","utf8");
console.log("tabGraph refs:", (h.match(/tabGraph/g)||[]).length);
console.log("Tabs Menu:", h.includes("Tabs Menu") ? "FOUND" : "REMOVED");
console.log('id="tabGraph":', h.includes('id="tabGraph"') ? "FOUND" : "REMOVED");
