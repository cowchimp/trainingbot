import { MongoClient } from 'mongodb';
import config from './config';

var mongoUrl = getMongoUrl();

async function getChallenges() {
  var db = await MongoClient.connect(mongoUrl);

  try {
    return await db.collection('challenges').find({}).toArray();
  } finally {
    db.close();
  }
}

async function getChallenge(query) {
  var db = await MongoClient.connect(mongoUrl);

  try {
    return await db.collection('challenges').find(query).limit(1).next();
  } finally {
    db.close();
  }
}

async function getPlayer(userId) {
  var db = await MongoClient.connect(mongoUrl);

  try {
    return await db.collection('players').find({ _id: userId }).limit(1).next();
  } finally {
    db.close();
  }
}

async function setActiveChallenge(userId, challengeId) {
  var db = await MongoClient.connect(mongoUrl);

  try {
    var filter = { _id: userId };
    var update = { $set: {
      activeChallenge: challengeId,
      questionIndex: 0,
      correctQuestionCount: 0
    } };
    return await db.collection('players').updateOne(filter, update, { upsert: true });
  } finally {
    db.close();
  }
}

async function advanceToNextQuestion(userId, shouldIncCorrectQuestionCount = false) {
  var db = await MongoClient.connect(mongoUrl);

  try {
    var filter = { _id: userId };
    var update = { $inc: {
      questionIndex: 1
    } };
    if(shouldIncCorrectQuestionCount) {
      update['$inc'].correctQuestionCount = 1;
    }
    return await db.collection('players').updateOne(filter, update, { upsert: true });
  } finally {
    db.close();
  }
}

function getMongoUrl() {
  var mongoUrl = config.get('mongoUrl');
  if(typeof mongoUrl != 'string' || !mongoUrl.length) {
    throw new Error ('Must pass `mongoUrl` configuartion');
  }
  mongoUrl = `mongodb://${mongoUrl}`;
  return mongoUrl;
}

export default {
  getChallenges: getChallenges,
  getChallengeByTitle: title => getChallenge(({ title: title })),
  getChallengeById: id => getChallenge(({ _id: id })),
  getPlayer: getPlayer,
  setActiveChallenge: setActiveChallenge,
  advanceToNextQuestion: advanceToNextQuestion
}