const EventEmitter = require("events");
const http = require("http");
class Sales extends EventEmitter {
  constructor() {
    super();
  }

  newSale(stock) {
    this.emit("newSale", stock);
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new Sale");
});

myEmitter.on("newSale", () => {
  console.log("Customer name:Jonas");
});
myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items added`);
});
myEmitter.newSale(9);

//////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});
server.on("request", (req, res) => {
  console.log(" Another request received");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for request");
});
