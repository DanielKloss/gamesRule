import { insertPlayerSession } from '../../sql/sql';

export async function post(request) {
    const game = request.body.game;
    const gameSessionId = request.body.gameSessionId;
    const playerId = request.body.playerId;
    const score = request.body.score;
    await insertPlayerSession(game, gameSessionId, playerId, score);
    
    return {
			status: 200,
			body: {
				result: 'Inserted player session'
			}
		};
}
