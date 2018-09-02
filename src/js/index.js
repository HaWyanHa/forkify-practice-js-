/*jshint esversion: 6*/
// import str from './models/Search';

// //import {add as a, multiply as m, ID} from './views/searchViews';

// import * as searchViews from './views/searchViews';

// console.log(`Using imported functions ${searchViews.add(searchViews.ID, 2)} and ${searchViews.multiply(3, 4)}. ${str}`);

import Search from './models/Search';
import * as searchView from './views/searchViews';
import {elements, renderLoader, clearLoader} from './views/base';
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
		searchView.clearResults();
		renderLoader(elements.searchResult);
	//4) Search for recipe
		await state.search.getResults();

	//5) Render results on UI
	clearLoader();
	searchView.renderResults(state.search.result);

};


elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});


//event delegation is used for event handlers on things that do not exist yet.
elements.searchResultsPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn){
		const goToPage = parseInt(btn.dataset.goto, 10);  //10 means base 10 which is 0-9
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
		console.log(goToPage);
	};
})

// const getResultsPromise = new Promise(query, function(resolve, reject) {
	
// 	const proxy = 'https://cors-anywhere.herokuapp.com/';
// 	const key = '201a70ec362fccd1bdf6358e706e8754';

// 	fetch(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);

// });

// getResultsPromise('test');