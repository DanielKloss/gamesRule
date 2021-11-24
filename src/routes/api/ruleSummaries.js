import { getRulesSummaries } from '../../sql/sql';

export async function get(request) {
	const id = request.query.get('id');
	return await getRulesSummaries(id);
}
