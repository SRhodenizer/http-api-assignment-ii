// data object
const users = {};

// responds with a json object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// responds without sending the json object
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// returns user as json objects
const getUsers = (request, response) => {
  // makes a json object with the users data
  const responseJSON = {
    users,
  };
    // responds with it
  respondJSON(request, response, 200, responseJSON);
};

// returns user as json objects
const getUsersMeta = (request, response) => {
  // responds with it
  respondJSONMeta(request, response, 200);
};

// adds a user to the users data
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // if the needed params are not send tell the user
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    respondJSON(request, response, 400, responseJSON);
    return;
  }
  // update default response code
  let responseCode = 201;

  // if it already exists update it
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // if not add a new empty json obj
    users[body.name] = {};
  }

  // update the new objects fields
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // if the response code is still created return that message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully.';
    respondJSON(request, response, responseCode, responseJSON);
    return;
  }
  // if not use the updated response code and update the list
  respondJSONMeta(request, response, responseCode);
};

const getNotFound = (request, response) => {
  respondJSON(request, response, 404, {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  });
};

const getNotFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// export methods
module.exports = {
  getUsers,
  addUser,
  getNotFound,
  getUsersMeta,
  getNotFoundMeta,
};
