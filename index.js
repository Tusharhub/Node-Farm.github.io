//////////////////////////////
//files

const fs = require("fs");
const http = require("http");
const { env } = require("process");
const { default: slugify } = require("slugify");
const url = require("url");
const replaceTemplate = require("./module/replace.js");
const port = process.env.PORT || 9000;
///////////////////////////////
//API
const Tempoverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  "utf-8"
);
const Tempcard = fs.readFileSync(`${__dirname}/template-card.html`, "utf-8");
const Tempproduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);

//////////////////////////////
//server

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(Tempcard, el))
      .join("");

    const output = Tempoverview.replace("{%Product_cards%}", cardsHtml);
    res.end(output);

    //product page
  } else if (pathname == "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(Tempproduct, product);
    res.end(output);
    //api
  } else if (pathname == "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    //error
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-own-header": "Hello World",
    });
    res.end("<h2>Page not Found</h2>");
  }
});
server.listen(port, () => {
  console.log("Listening to the request on port 8000");
});
