import { getAllGameSessions } from '../../sql/sql';

export async function get(request) {
    const shortName = request.query.get('shortName');
    return await getAllGameSessions(shortName)
}
