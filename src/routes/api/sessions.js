import { getAllGameSessions, insertSession } from '../../sql/sql';

export async function get(request) {
    const id = request.url.searchParams.get('id');
    return await getAllGameSessions(id)
}

export async function post({ request }) {
    let data = await request.json();
    const date = data.date;
    const gameId = data.gameId;
    const coopWin = data.coopWin;
    result = await insertSession(date, gameId, coopWin);
    
    return {
        status: 200,
        body: {
            gameSessionId: result[0],
            result: "Inserted Session"
        }
    }
}