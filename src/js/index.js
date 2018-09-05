/*jshint esversion: 6*/
// import str from './models/Search';

// //import {add as a, multiply as m, ID} from './views/searchViews';

// import * as searchViews from './views/searchViews';

// console.log(`Using imported functions ${searchViews.add(searchViews.ID, 2)} and ${searchViews.multiply(3, 4)}. ${str}`);

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeViews';

import {elements, renderLoader, clearLoader} from './views/base';
/****Global State of the app
|
|* - Search object
|* - Current recipe object
|* - Shopping list object
|* - Liked recipes
|
*/
const state = {};  //all of our data is stored in one central place called the state, so we just need to access the state



//Search Controller
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
	
		try {

			//4) Search for recipe
			await state.search.getResults();

			//5) Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);

		} catch (error){
			alert('something went in index');
			clearLoader();
		}
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

//Recipe Controller

const controlRecipe = async () => {
	
	//Get ID from URL
	const id = window.location.hash.replace('#','');
	console.log(id)

	if (id) {
		//Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//Highlight selected search item
		if (state.search) searchView.highlightSelected(id);


		//Create new recipe object
		state.recipe = new Recipe(id);

		try {

			//Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			

			//Calculate servings and time
			state.recipe.calcTime()
			state.recipe.calcServings();
			

			//Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
			
			console.log(state.recipe);

		} catch (error) {
			alert ('there is an error');
		}
	}

}


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));


const r = new Recipe(47746)
r.getRecipe();
console.log(r);






// const getResultsPromise = new Promise(query, function(resolve, reject) {
	
// 	const proxy = 'https://cors-anywhere.herokuapp.com/';
// 	const key = '201a70ec362fccd1bdf6358e706e8754';

// 	fetch(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);

// });

// getResultsPromise('test');