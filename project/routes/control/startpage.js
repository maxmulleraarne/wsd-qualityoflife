import { getSingleUser } from "../../services/reportcontentService.js";
import { getTrendOfInterval, getDateInterval } from "../apis/reportcontentAPI.js";

const startingPage = async({render, session}) => {
    const auth = await session.get('authenticated');
    const days = await getDateInterval(0,28);
    const last_month = await getTrendOfInterval(days[0], days[1]);
    const data = {
        lm: last_month
    };
    if (auth === 'authenticated') {
        const mail = await session.get('user');
        console.log(mail);
        const user = await getSingleUser(mail);
        if (user === 'No') {
            await session.set('authenticated', 'not');
            render('index.ejs', data);
        } else {
            render('ownpage.ejs', user);
        }
    } else {
        render('index.ejs', data);
    }
}

export  {startingPage};