import { getAllGameSessions, insertSession } from '../../sql/sql';

export async function get(request) {
    const id = request.query.get("id");
    return await getAllGameSessions(id)
}

export async function post(request) {
    const date = request.body.date;
    const gameId = request.body.gameId;
    const coopWin = request.body.coopWin;
    gameSessionId = await insertSession(date, gameId, coopWin);
    
    return {
        status: 200,
        body: {
            gameSessionId: gameSessionId[0],
            result: "Inserted Session"
        }
    }
}