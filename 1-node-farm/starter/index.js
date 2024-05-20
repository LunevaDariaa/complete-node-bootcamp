const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////////////////////////
//FILES

//Blocking synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is what we know about the avocado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-Blocking asynchronous way

//Callback hell representation
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written😀");
//       });
//     });
//   });
// });
// console.log("Will read file");

// Async/await

/////////////////////////////////////////////////
//SERVER

function replaceTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace("{%NOT_ORGANIC%}", "not-organic");
  return output;
}

//Reading a data once in the beginning to then use them
const tempOverview = fs.readFileSync(
  `../final/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `../final/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `../final/templates/template-product.html`,
  "utf-8"
);

//calling a data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//Created server
const server = http.createServer((req, res) => {
  // const { query, pathname: pathName } = url.parse(req.url, true);
  const { searchParams, pathname: pathName } = new URL(
    req.url,
    "http://127.0.0.1:8000"
  );
  const query = Object.fromEntries(searchParams.entries());
  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product page
  } else if (pathName === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API page
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end("<h1>Page Not found!<h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on post 8000");
});
