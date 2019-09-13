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

    this._endpointsLoaded = false;
    this._questionsLoaded = false;
    this._workshopsLoaded = {};
    this._responsesLoaded = {};
  }

  async loadQuestions() {
    // TODO: Handle errors
    if (this._questionsLoaded === true) return;

    let questions = await this._database.loadQuestions();
    for (let question of questions) {
      this.questions.push(question);
      this._questionsMap[question.id] = question;
    }

    this._questionsLoaded = true;
  }

  async loadEndpoints() {
    // TODO: Handle errors
    if (this._endpointsLoaded === true) return;

    let endpoints = await this._database.loadEndpoints();
    for (let endpoint of endpoints) {
      this.endpoints.push(endpoint);
      this._endpointsMap[endpoint.id] = endpoint;
    }

    this._endpointsLoaded = true;
  }

  async loadWorkshops(endpointId) {
    // TODO: Handle errors
    if (this._workshopsLoaded[endpointId] === true) return;

    let workshops = await this._database.loadWorkshops(endpointId);

    let workshopsMapObject = (this._workshopsMap[endpointId] = {});
    let responsesMapObject = (this._responsesMap[endpointId] = {});
    let workshopsArray = this._endpointsMap[endpointId].workshops;
    for (let workshop of workshops) {
      workshopsArray.push(workshop);
      workshopsMapObject[workshop.id] = workshop;
      responsesMapObject[workshop.id] = {};
    }

    this._workshopsLoaded[endpointId] = true;
    this._responsesLoaded[endpointId] = {};
  }

  async loadResponses(endpointId, workshopId) {
    // TODO: Handle errors
    if (
      this._responsesLoaded[endpointId] != null &&
      this._responsesLoaded[endpointId][workshopId] === true
    )
      return;

    let allResponses = await this._database.loadResponses(
      endpointId,
      workshopId
    );

    // Forma: { person: [ { person: person, question: questionId, type: type, value: value } ] }
    let responsesEndpointWorkshop = this._responsesMap[endpointId][workshopId];
    let workshopsEndpointWorkshop = this._workshopsMap[endpointId][workshopId];
    workshopsEndpointWorkshop.responses = [];
    for (let person of Object.keys(allResponses)) {
      let personResponses = allResponses[person];
      responsesEndpointWorkshop[person] = personResponses;

      for (let response of personResponses) {
        workshopsEndpointWorkshop.responses.push(response);
      }
    }

    if (this._responsesLoaded[endpointId] == null) {
      this._responsesLoaded[endpointId] = { workshopId: true };
    } else {
      this._responsesLoaded[endpointId][workshopId] = true;
    }
  }

  async loadUsers() {
    // TODO: Handle errors
    // TODO: Add usersLoaded
    // TODO: Add live listeners
    let users = await this._database.loadUsers();
    for (let user of users) {
      this.users.push(user);
      this._usersMap[user.id] = user;
    }
  }

  getEndpoints() {
    return this.endpoints;
  }

  getEndpointByID(endpointId) {
    return this._endpointsMap[endpointId];
  }

  getWorkshops(endpointId) {
    return this._endpointsMap[endpointId].workshops;
  }

  getWorkshopByID(endpointId, workshopId) {
    let workshopMap = this._workshopsMap[endpointId];
    return workshopMap != null ? workshopMap[workshopId] : undefined;
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
