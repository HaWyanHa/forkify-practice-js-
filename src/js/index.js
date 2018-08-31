/*jshint esversion: 6*/
// import str from './models/Search';

// //import {add as a, multiply as m, ID} from './views/searchViews';

// import * as searchViews from './views/searchViews';

// console.log(`Using imported functions ${searchViews.add(searchViews.ID, 2)} and ${searchViews.multiply(3, 4)}. ${str}`);

import Search from './models/Search';
import * as searchView from './views/searchViews';
import {elements} from './views/base';
/****Global State of the app
|
|* - Search object
|* - Current recipe object
|* - Shopping list object
|* - Liked recipes
|
*/
const state = {};

const controlSearch = async () => {
	//1) Get query from view
		const query = searchView.getInput();
		console.log(query);
		if (query) {
			// New search object and add to state
			state.search = new Search(query);
		}
	//3) Prepare UI for the results
		searchView.clearInput();
	//4) Search for recipe
		await state.search.getResults();

	//5) Render results on UI
	searchView.renderResults(state.search.result);
};


elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});




// const getResultsPromise = new Promise(query, function(resolve, reject) {
	
// 	const proxy = 'https://cors-anywhere.herokuapp.com/';
// 	const key = '201a70ec362fccd1bdf6358e706e8754';

// 	fetch(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);

// });

// getResultsPromise('test');