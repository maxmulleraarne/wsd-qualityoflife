import { executeQuery } from "../database/database.js";

const getUsers = async() => {
    const res = await executeQuery("SELECT * FROM users");
    if (res && res.rowCount > 0) {
      return res.rowsOfObjects();
    }
  
    return 'No users registered';
}

const getSingleUser = async(email) => {
  const res = await executeQuery("SELECT * FROM users WHERE mail = $1;", email);
  if (!res || res.rowCount === 0) {
    return 'No';
  }

  return res.rowsOfObjects()[0];
}

const getAllContent = async() => {
  let no_content = false;
  const morning = await executeQuery("SELECT * FROM morning_content");
  if (!(morning || morning.rowCount > 0)) {
    no_content = true;
    morning = [];
  }

  const evening = await executeQuery("SELECT * FROM evening_content");
  if (!(evening || evening.rowCount > 0)) {
    if (no_content) {
      return 'No content reported';
    }
    evening = [];
  } 

  return {morning, evening};
}

const getUserContent = async(user, name) => {
    const res = await executeQuery("SELECT * FROM reported_content WHERE user = $1", user);
    if (res && res.rowCount > 0) {
      return res.rowsOfObjects();
    }
  
    return `No reported content available for user ${name}`;
}

const addUser = async(user, name, pw) => {
    await executeQuery("INSERT INTO users (mail, name, password) VALUES ($1, $2, $3);", user, name, pw);
}

const addMorningContent = async(user, content, date) => {
    await executeQuery("INSERT INTO morning_content (mail, sleepduration, sleepquality, mood, date) VALUES ($1, $2, $3, $4, $5);", user, content[0], content[1], content[2], date);
}

const addEveningContent = async(user, content, date) => {
  await executeQuery("INSERT INTO evening_content (mail, sportduration, studyduration, eating, mood, date) VALUES ($1, $2, $3, $4, $5, $6);", user, content[0], content[1], content[2], content[3], date);
}

export { getUsers, getAllContent, getUserContent, addUser, addEveningContent, addMorningContent, getSingleUser};