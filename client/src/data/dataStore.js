class DataStore {
  constructor(database) {
    this._database = database;

    this.users = [];
    this.endpoints = [];
    this.questions = [];

    this._usersMap = {};
    this._questionsMap = {};
    this._questionsValueMap = {};
    this._endpointsMap = {};
    this._workshopsMap = {};
    this._responsesMap = {};

    this._usersLoaded = false;
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
      this._questionsMap[String(question.id)] = question;
      let valueMap = (this._questionsValueMap[String(question.id)] = {});
      if (question.t === "c") {
        for (let value of question.v) {
          valueMap[value.v] = value.d;
        }
      }
    }

    this._questionsLoaded = true;
  }

  async loadEndpoints() {
    // TODO: Handle errors
    if (this._endpointsLoaded === true) return;

    let endpoints = await this._database.loadEndpoints();
    for (let endpoint of endpoints) {
      this.endpoints.push(endpoint);
      this._endpointsMap[String(endpoint.id)] = endpoint;
    }

    this._endpointsLoaded = true;
  }

  async loadWorkshops(endpointId) {
    // TODO: Handle errors
    if (this._workshopsLoaded[endpointId] === true) return;

    let workshops = await this._database.loadWorkshops(endpointId);

    let workshopsMapObject = (this._workshopsMap[endpointId] = {});
    let responsesMapObject = (this._responsesMap[endpointId] = {});
    let workshopsArray = this._endpointsMap[endpointId].w;
    for (let workshop of workshops) {
      workshopsArray.push(workshop);
      workshopsMapObject[String(workshop.id)] = workshop;
      responsesMapObject[String(workshop.id)] = {};
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

    // Forma In: { person: { question: { type: value } } }
    // Forma Out: [ { person: person, responses: [ { question: { type: value } } ] } }
    let responsesEndpointWorkshop = this._responsesMap[endpointId][workshopId];
    let workshopsEndpointWorkshop = this._workshopsMap[endpointId][workshopId];
    workshopsEndpointWorkshop.r = [];
    for (let personId of Object.keys(allResponses)) {
      let output = {
        p: personId,
        r: []
      };
      workshopsEndpointWorkshop.r.push(output);

      let personResponses = allResponses[personId];
      responsesEndpointWorkshop[personId] = personResponses;

      for (let questionId of Object.keys(personResponses)) {
        let responses = personResponses[questionId];

        let outputPre = {
          q: questionId,
          t: "PRE",
          v: responses["PRE"],
          id: questionId + "PRE"
        };
        let outputPost = {
          q: questionId,
          t: "POST",
          v: responses["POST"],
          id: questionId + "POST"
        };

        output.r.push(outputPre);
        output.r.push(outputPost);
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
    // TODO: Add live listeners
    if (this._usersLoaded === true) return;

    let users = await this._database.loadUsers();
    for (let user of users) {
      this.users.push(user);
      this._usersMap[String(user.id)] = user;
    }

    this._usersLoaded = true;
  }

  getEndpoints() {
    return this.endpoints;
  }

  getEndpointByID(endpointId) {
    return this._endpointsMap[endpointId];
  }

  getWorkshops(endpointId) {
    return this._endpointsMap[endpointId].w;
  }

  getWorkshopByID(endpointId, workshopId) {
    let workshopMap = this._workshopsMap[endpointId];
    return workshopMap != null ? workshopMap[workshopId] : undefined;
  }

  getQuestions() {
    return this.questions;
  }

  getQuestionByID(questionId) {
    return this._questionsMap[questionId];
  }

  getQuestionValueDescriptionByID(questionId, value) {
    let questionValues = this._questionsValueMap[questionId];
    return questionValues != null ? questionValues[value] : undefined;
  }

  getResponses(endpointId, workshopId) {
    return this._workshopsMap[endpointId][workshopId].r;
  }

  getUsers() {
    return this.users;
  }

  getUser(userId) {
    return this._usersMap[userId];
  }
}

export default DataStore;
