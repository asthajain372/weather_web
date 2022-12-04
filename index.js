const http = require ("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("index.html","utf-8");
const replaceval =(tempval,orgval)=>{
    
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature = temperature.replace("{%locations%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);
   return temperature;
    
};
const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=ahmedabad&appid=a36b4783fdc4b7acb1bd33e98868cff8")
        .on("data",(chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val)=>replaceval(homeFile , val)).join("");
            res.write(realTimeData);

        })
        .on("end",(err) => {
            if(err) return console.log("connection closed due to the error", err);
            // console.log("end");
            res.end();
        })
    }
    else {
        res.end("File not found ");
    }

});
server.listen(3000,"127.0.0.1");