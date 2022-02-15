import { getAllPlayers, insertPlayer } from '../../sql/sql';

export async function get(request) {
	return await getAllPlayers();
}

export async function post({ request }) {
	const data = await request.json();

	const name = data.name;
	const colour = data.colour;
	await insertPlayer(name, colour);

	return {
		status: 200
	};
}
