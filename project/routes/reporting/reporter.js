import { getSingleUser, addEveningContent, addMorningContent, getUserContent } from "../../services/reportcontentService.js";


const reportContent = async({render, session}) => {
    const mail = await session.get('user');
    let today = new Date();
    const yest = today.getDate();
    let dd = today.getDate();
    const mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }
    const data = {
        mail: mail,
        sleepd: '',
        sleepq: '',
        mmood: '',
        emood: '',
        sport: '',
        study: '',
        eating: '',
        date: `${yyyy}-${mm}-${dd}`,
        errors: []
    }
    render('chooseReport.ejs', data);
}

const morningReport = async({render, request, session}) => {
    const mail = await session.get('user');
    const data = {
        mail: mail,
        sleepd: '',
        sleepq: '',
        mmood: '',
        emood: '',
        sport: '',
        study: '',
        eating: '',
        errors: []
    }
    let errors = false;
    const body = request.body();
    const params = await body.value;
    const user = await getSingleUser(await session.get('user'));

    let content = [];

    const sleepduration = params.get('sleepduration');
    const sleepquality = params.get('sleepquality');
    const mood = params.get('mood');
    const date = params.get('date');
    data.date = date;

    console.log(!(isNaN(sleepquality)));

    if (isNaN(sleepduration) || sleepduration > 24 || sleepduration < 0) {
        data.errors.push('Invalid sleepduration');
        errors = true;
    } else {
        data.sleepd = sleepduration;
    }

    if (isNaN(sleepquality) || sleepquality > 5 || sleepquality < 1) {
        data.errors.push('Invalid sleepquality');
        errors = true;
    } else {
        data.sleepq = sleepquality;
    }

    if (isNaN(mood) || mood > 5 || mood < 1) {
        data.errors.push('Invalid mood');
        errors = true;
    } else {
        data.mmood = mood;
    }

    if (errors) {
        render('chooseReport.ejs', data);
    } else {
        content.push(sleepduration);
        content.push(sleepquality);
        content.push(mood);

        await addMorningContent(user.mail, content, date);
        render('ownpage.ejs', user);
    }
}

const eveningReport = async({render, request, session}) => {
    const mail = await session.get('user');
    const data = {
        mail: mail,
        sleepd: '',
        sleepq: '',
        mmood: '',
        emood: '',
        sport: '',
        study: '',
        eating: '',
        errors: []
    }

    let errors = false;
    const body = request.body();
    const params = await body.value;
    const user = await getSingleUser(await session.get('user'));

    let content = [];

    const sport = params.get('sport');
    const study = params.get('study');
    const eating = params.get('eating');
    const mood = params.get('mood');
    const date = params.get('date');
    data.date = date;

    if (isNaN(sport) || sport > 24 || sport < 0) {
        data.errors.push('Invalid time spent on sports');
        errors = true;
    } else {
        data.sport = sport;
    }

    if (isNaN(study) || study > 24 || study < 0) {
        data.errors.push('Invalid time spent on studying');
        errors = true;
    } else {
        data.study = study;
    }

    if (isNaN(eating) || eating > 5 || eating < 1) {
        data.errors.push('Invalid quality of eating');
        errors = true;
    } else {
        data.eating = eating;
    }

    if (isNaN(mood) || mood > 5 || mood < 1) {
        data.errors.push('Invalid mood');
        errors = true;
    } else {
        data.emood = mood;
    }

    if (errors) {
        render('chooseReport.ejs', data);
    } else {
        content.push(sport);
        content.push(study);
        content.push(eating);
        content.push(mood);

        await addEveningContent(user.mail, content, date);


        render('ownpage.ejs', user);
    }
}

export{reportContent, morningReport, eveningReport};