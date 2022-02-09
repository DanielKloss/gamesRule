import { getRules } from '../../sql/sql';

export async function get(request) {
	const id = request.url.searchParams.get('id');
	return await getRules(id);
}
