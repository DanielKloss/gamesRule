import { getAllPlayers } from '../../sql/sql';

export async function get(request) {
	return await getAllPlayers();
}
