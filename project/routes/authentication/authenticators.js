import { addUser, getSingleUser } from "../../services/reportcontentService.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const loginUser = async({render}) => {
  data.errors = [];
  render('login.ejs', data);
};

const data = {
  email: '',
  name: '',
  errors: []
};

const submitLogin = async({render, request, session}) => {
  data.errors = [];
  const body = request.body();
  const params = await body.value;
  const email = params.get('email');
  const password = params.get('password');
  const user = await getSingleUser(email);
  if (user === 'No') {
    data.errors = ['Invalid email or password'];
  }

  const pw = user.password;
  if (!(await bcrypt.compare(password, pw))) {
    data.errors = ['Invalid email or password'];
  }

  if (data.errors.length != 0) {
    render('login.ejs', data)
  } else {
    await session.set('user', email);
    await session.set('authenticated', 'authenticated');
    render('ownpage.ejs', user);
  }
};

const registerUser = async({render}) => {
  render('register.ejs', data);
};

const submitRegistration = async({render, request, response}) => {
  data.errors = [];
  data.email = '';
  data.name = '';
  let errors = false;
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const name = params.get('name');
  const password = params.get('password');

  if (!(email.length > 0)) {
    data.errors.push('email not given or not a valid email');
    errors = true;
  } else if (!(email.includes('@'))) {
    data.errors.push('email must contain @');
    errors = true;
    data.email = email;
  } else {
    const user = await getSingleUser(email);
    if (user != 'No') {
      data.errors.push('The given email is already registered');
    } else {
      data.email = email;
    }
  }
  
  if (!(name.length > 0)) {
    data.errors.push('name not given');
    errors = true;
  } else {
    data.name = name;
  }

  if (!(password.length > 3)) {
    data.errors.push('password not given or too short (min 4 chars.)');
    errors = true;
  }

  if (errors) {
    render('register.ejs', data)
  } else {
    const pw = await bcrypt.hash(password);
    await addUser(email, name, pw);
    response.redirect('/');
  }
  
};

const logOut = async({render, session, response}) => {
  await session.set('authenticated', 'Not');
  await session.set('user', 'None');
  response.redirect('/');
}

const logOutButton = async({render}) => {
  render('logout.ejs');
}

const singleNews = async({render, response, params, session}) => {
  let visits = await session.get('visit-count');
  if (!visits) {
    visits = 1;
  }

  await session.set('visit-count', Number(visits) + 1);
  if (visits < 4) {
    let news = await getSingleNews(params.user, params.name);
    render('news-item.ejs', {news: news});
  } else {
    response.body = "This content is only for paying users";
  }
};
 
export { loginUser, registerUser, submitLogin, submitRegistration, logOut, logOutButton };