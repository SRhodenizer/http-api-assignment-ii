// pulls in the http module
const http = require('http');
// get the url module
const url = require('url');
// querystring module for parsing querystrings in the url
const query = require('querystring');
// pull in the response finals
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./responses.js');

// sets up the port for the server
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle GET requests
const handleGet = (request, response, parsedUrl, method) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else
  if (parsedUrl.pathname === '/getUsers') {
    if (method === 'GET') {
      jsonHandler.getUsers(request, response);
    } else {
      jsonHandler.getUsersMeta(request, response);
    }
  } else
  if (parsedUrl.pathname === '/notReal') {
    if (method === 'GET') {
      jsonHandler.getNotFound(request, response);
    } else {
      jsonHandler.getNotFoundMeta(request, response);
    }
  } else {
    jsonHandler.getNotFound(request, response);
  }
};

const handlePost = (request, response, parsedUrl) => {
  // if the post call is addUser
  if (parsedUrl.path === '/addUser') {
    // make the response accessible
    const res = response;

    // make a body array
    const body = [];

    // errors on bad request
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // adds data bytes to body array
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // when the upload stream ends
    request.on('end', () => {
      // take all the data in the byte array and makes it a string
      const bodyString = Buffer.concat(body).toString();
      // parses the string into objects by field name
      const bodyParams = query.parse(bodyString);
      // passes to addUser function
      jsonHandler.addUser(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  // parse the url using the url module
  // This will let us grab any section of the URL by name
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    // handles the post request
    handlePost(request, response, parsedUrl);
  } else {
    // handles the get request
    handleGet(request, response, parsedUrl, request.method);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
