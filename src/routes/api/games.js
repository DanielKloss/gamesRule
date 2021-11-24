import { getAllGames, getGame } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get("id");
	if (id == -1) {
		return await getAllGames();
	} else {
		return await getGame(id);
	}
}
