import { writable } from 'svelte/store';

export const filters = writable({
	filtersOn: false,
	maxPlayTime: 0,
	maxPlayers: 0,
	playTime: 0,
	players: 0,
	categories: [],
	mechanics: [],
	searchTerm: ''
}); 
