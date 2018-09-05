/*jshint esversion: 6*/
// import str from './models/Search';

// //import {add as a, multiply as m, ID} from './views/searchViews';

// import * as searchViews from './views/searchViews';

// console.log(`Using imported functions ${searchViews.add(searchViews.ID, 2)} and ${searchViews.multiply(3, 4)}. ${str}`);

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeViews';
import * as listView from './views/listViews';
import * as likesView from './views/likesViews';


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
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
			
			console.log(state.recipe);

		} catch (error) {
			alert ('there is an error');
		}
	}

}


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));

//LIST CONTROLLER
const controlList = () => {
	//Create a new list IF there is none yet
	if (!state.list) state.list = new List();


	//Add each ingredient to the list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el. ingredient);
		listView.renderItem(item)
	})
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	//Handle the delete button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		
		//Delete from state
		state.list.deleteItem(id);
		
		//Delete from UI
		listView.deleteItem(id);

		//Handle the count update
	}else if (e.target.matches('.shopping__count-value')) {
		const value = parseFloat(e.target.value, 10);
		state.list.updateCount(id, value);
	}
});


//LIKE CONTROLLER


//testing
state.likes = new Likes();

const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;


	//User has NOT yet liked the current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add like to the state
		const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
		//Toggle the like button
		likesView.toggleLikeBtn(true);
		
		//Add like to UI list
		likesView.renderLike(newLike);
		console.log(state.likes);
	//User HAS liked the current recipe

	} else {
		//Remove like from the state
		state.likes.deleteLike(currentID);
		//Toggle the like button
		likesView.toggleLikeBtn(false);
		//Remove like from UI list
		likesView.deleteLike(currentID);
		console.log(state.likes);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
}


//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		
		//decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}

	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		
		//Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		
		//Add ingredients to shopping list
		controlList();

	
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		//Call the Like Controller
		controlLike();
		console.log('working');


	}
}); 


window.l = new List()





// const r = new Recipe(47746)
// r.getRecipe();
// console.log(r);






// const getResultsPromise = new Promise(query, function(resolve, reject) {
	
// 	const proxy = 'https://cors-anywhere.herokuapp.com/';
// 	const key = '201a70ec362fccd1bdf6358e706e8754';

// 	fetch(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);

// });

// getResultsPromise('test');