import { insertPlayerSession } from '../../sql/sql';

export async function post({ request }) {
    const data = await request.json();
    const gameSessionId = data.gameSessionId;
    const playerId = data.playerId;
    const score = data.score;
    await insertPlayerSession(gameSessionId, playerId, score);
    
    return {
			status: 200,
			body: {
				result: 'Inserted player session'
			}
		};
}
