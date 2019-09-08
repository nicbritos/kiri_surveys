class DataStore {
  constructor(database) {
    this._database = database;

    this.endpoints = [];
    this.questions = [];
    this.users = [];

    this._endpointsMap = {};
    this._workshopsMap = {};
    this._questionsMap = {};
    this._responsesMap = {};
    this._usersMap = {};
  }

  async loadEndpoints() {
    // TODO: Handle errors
    let endpoints = await this._database.loadEndpoints();
    for (let endpoint of endpoints) {
      this.endpoints.push(endpoint);
      this._endpointsMap[endpoint.id] = endpoint;
    }
  }

  async loadWorkshops(endpointId) {
    // TODO: Handle errors
    let workshops = await this._database.loadWorkshops(endpointId);

    let workshopsMapObject = (this._workshopsMap[endpointId] = {});
    let responsesMapObject = (this._responsesMap[endpointId] = {});
    let workshopsArray = this._endpointsMap[endpointId].workshops;
    for (let workshop of workshops) {
      workshopsArray.push(workshop);
      workshopsMapObject[workshop.id] = workshop;
      responsesMapObject[workshop.id] = {};
    }
  }

  async loadQuestions() {
    // TODO: Handle errors
    let questions = await this._database.loadQuestions();
    for (let question of questions) {
      this.questions.push(question);
      this._questionsMap[question.id] = question;
    }
  }

  async loadResponses(endpointId, workshopId) {
    // TODO: Handle errors
    let allResponses = await this._database.loadResponses(
      endpointId,
      workshopId
    );

    // Forma: { person: [{person: person, question: questionId, type: type, value: value}]}
    let responsesEndpointWorkshop = this._responsesMap[endpointId][workshopId];
    let workshopsEndpointWorkshop = this._workshopsMap[endpointId][workshopId];
    workshopsEndpointWorkshop.responses = [];
    for (let personResponses of allResponses) {
      responsesEndpointWorkshop[personResponses.person] = personResponses;
      for (let response of personResponses) {
        workshopsEndpointWorkshop.responses.push(response);
      }
    }
  }

  async loadUsers() {
    // TODO: Handle errors
    let users = await this._database.loadUsers();
    for (let user of users) {
      this.users.push(user);
      this._usersMap[user.id] = user;
    }
  }

  getEndpoints() {
    return this.endpoints;
  }

  getWorkshops(endpointId) {
    return this._endpointsMap[endpointId].workshops;
  }

  getQuestions() {
    return this.questions;
  }

  getResponses(endpointId, workshopId) {
    return this._workshopsMap[endpointId][workshopId].responses;
  }

  getUsers() {
    return this.users;
  }

  getUser(userId) {
    return this._usersMap[userId];
  }
}

export default DataStore;
