import { Router, Session } from "../deps.js";
import * as auth from "./authentication/authenticators.js";
import * as api from "./apis/reportcontentAPI.js";
import * as report from "./reporting/reporter.js";
import * as control from "./control/startpage.js";

const router = new Router();

router.get('/', control.startingPage);
router.post('/', control.startingPage);

router.post('/auth/login', auth.loginUser);
router.get('/auth/login', auth.loginUser);
router.post('/auth/submitlogin', auth.submitLogin);
router.post('/auth/registration', auth.registerUser);
router.get('/auth/registration', auth.registerUser);
router.post('/auth/submitregistration', auth.submitRegistration);
router.post('/auth/logout', auth.logOut);
router.get('/auth/logout', auth.logOutButton);

router.post('/behavior/reporting', report.reportContent);
router.get('/behavior/reporting', report.reportContent);
router.post('/behavior/morningreport', report.morningReport);
router.post('/behavior/eveningreport', report.eveningReport);
router.post('/behavior/summary', api.userSummary);
router.post('/behavior/chooseInterval', api.intervalSummary);

router.get("/api/summary", api.getSummary);
router.get("/api/summary/:year/:month/:day", api.getDay);

export { router };