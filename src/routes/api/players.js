import { getAllPlayers, insertPlayer } from '../../sql/sql';

export async function get(request) {
	return await getAllPlayers();
}

export async function post(request) {
	const name = request.body.name;
	const colour = request.body.colour;
	await insertPlayer(name, colour);

	return {
		status: 200
	};
}
