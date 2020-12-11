import { executeQuery } from "../../database/database.js";

const userSummary = async({render, session}) => {
    const user = await session.get('user');
    const last_week = await getDateInterval(0,7);
    const last_month = await getDateInterval(0,28);
    const last_weeks_data = await getUserTrend(last_week[0], last_week[1], user);
    const last_months_data = await getUserTrend(last_month[0], last_month[1], user);

    const data = {
        lw: last_weeks_data,
        lm: last_months_data
    }

    render('summary.ejs', data);


}

const intervalSummary = async({request, render, session}) => {
    const user = await session.get('user');
    const body = request.body();
    const params = await body.value;

    const start = await params.get('startdate');
    const end = await params.get('enddate');

    const last_weeks_data = await getUserTrend(end, start, user);

    const data = {
        lw: last_weeks_data,
        start: start,
        end: end
    }

    render('customsummary.ejs', data);
}

const getDateInterval = async(daysfromend, daysfromstart) => {
    let today = new Date();
    const enddate = today.getDate() - daysfromend;
    const startdate = today.getDate() - daysfromstart;

    today.setDate(enddate);
    let dde = today.getDate();
    const mme = today.getMonth()+1;
    const yyyye = today.getFullYear();

    today.setDate(startdate);
    let dds = today.getDate();
    const mms = today.getMonth()+1;
    const yyyys = today.getFullYear();
    
    if (dds < 10) {
        dds = `0${dds}`;
    }

    if (dde < 10) {
        dde = `0${dde}`;
    }

    const endtime = `${yyyye}-${mme}-${dde}`;
    const starttime = `${yyyys}-${mms}-${dds}`;
    const times = [];
    times.push(endtime);
    times.push(starttime);
    return times;

}

const getTrendOfInterval = async(start, end) => {
    const sleepduration = await executeQuery("SELECT AVG(sleepduration) FROM morning_content WHERE date <= $1 AND date >= $2;", start, end);
    const sleepquality= await executeQuery("SELECT AVG(sleepquality) FROM morning_content WHERE date <= $1 AND date >= $2;", start, end);
    const mmood = await executeQuery("SELECT AVG(mood) FROM morning_content WHERE date <= $1 AND date >= $2;", start, end);
    const sport = await executeQuery("SELECT AVG(sportduration) FROM evening_content WHERE date <= $1 AND date >= $2;", start, end);
    const study = await executeQuery("SELECT AVG(studyduration) FROM evening_content WHERE date <= $1 AND date >= $2;", start, end);
    const eating = await executeQuery("SELECT AVG(eating) FROM evening_content WHERE date <= $1 AND date >= $2;", start, end);
    const emood = await executeQuery("SELECT AVG(mood) FROM evening_content WHERE date <= $1 AND date >= $2;", start, end);
    
    const data = {
        sleepd: '',
        sleepq: '',
        mormood: '',
        sportdur: '',
        studydur: '',
        eat: '',
        evemood: ''
    }

    if (sleepduration && sport) {
        data.sleepd = sleepduration.rowsOfObjects()[0].avg;
        data.sleepq = sleepquality.rowsOfObjects()[0].avg;
        data.mormood = mmood.rowsOfObjects()[0].avg;
        data.sportdur = sport.rowsOfObjects()[0].avg;
        data.studydur = study.rowsOfObjects()[0].avg;
        data.eat = eating.rowsOfObjects()[0].avg;
        data.evemood = emood.rowsOfObjects()[0].avg;

    }

    return data;
}

const getUserTrend = async(start, end, mail) => {
    const sleepduration = await executeQuery("SELECT AVG(sleepduration) FROM morning_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);
    const sleepquality= await executeQuery("SELECT AVG(sleepquality) FROM morning_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);
    const mmood = await executeQuery("SELECT AVG(mood) FROM morning_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);
    const sport = await executeQuery("SELECT AVG(sportduration) FROM evening_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail); 
    const study = await executeQuery("SELECT AVG(studyduration) FROM evening_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);
    const eating = await executeQuery("SELECT AVG(eating) FROM evening_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);
    const emood = await executeQuery("SELECT AVG(mood) FROM evening_content WHERE date <= $1 AND date >= $2 AND mail = $3;", start, end, mail);

    const data = {
        sleepd: '',
        sleepq: '',
        mormood: '',
        sportdur: '',
        studydur: '',
        eat: '',
        evemood: ''
    }

    if (sleepduration && sport) {
        data.sleepd = sleepduration.rowsOfObjects()[0].avg;
        data.sleepq = sleepquality.rowsOfObjects()[0].avg;
        data.mormood = mmood.rowsOfObjects()[0].avg;
        data.sportdur = sport.rowsOfObjects()[0].avg;
        data.studydur = study.rowsOfObjects()[0].avg;
        data.eat = eating.rowsOfObjects()[0].avg;
        data.evemood = emood.rowsOfObjects()[0].avg;

    }

    return data;
}


   
export { getUserTrend, getTrendOfInterval, userSummary, intervalSummary, getDateInterval };