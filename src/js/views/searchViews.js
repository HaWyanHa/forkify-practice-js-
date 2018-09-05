/*jshint esversion: 6*/

import {elements} from './base';

export const getInput = () => elements.searchInput.value;  //implicit return

export const clearInput = () => {
	elements.searchInput.value = '';   //no return so use { }
};

export const clearResults = () => {
	elements.searchResList.innerHTML = '';
	elements.searchResultsPages.innerHTML = ' ';
};


export const highlightSelected = id => {
	const resultsArray = Array.from(document.querySelectorAll('.results__link'));
	resultsArray.forEach(el => {
		el.classList.remove('results__link--active');
	});
	
	document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};
/*
// "pasta with tomato and spinach"
accumulator = 0 / accumulator + currentValue.length = 5 /newTitle = ['pasta']
accumulator = 5 / accumulator + currentValue.length = 9 /newTitle = ['pasta', with']
accumulator = 9 / accumulator + currentValue.length = 15 /newTitle = ['pasta', with', 'tomato']
accumulator = 15 / accumulator + currentValue.length = 18 /newTitle = ['pasta', with', 'tomato']
accumulator = 18 / accumulator + currentValue.length = 24 /newTitle = ['pasta', with', 'tomato']
*/
const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((accumulator, currentValue) => {
			if (accumulator + currentValue.length <= limit) {
				newTitle.push(currentValue);
				//console.log(newTitle);
			}
			return accumulator + currentValue.length;
		}, 0); // accumulator = 0


	} else newTitle.push(title);//no need for an else becuase there is a return above
	return `${newTitle.join(' ')} ...`;
};

const renderRecipe = (recipe) => {
	const markup = `
        <li>
        	<a class="results__link" href="#${recipe.recipe_id}">
            	<figure class="results__fig">
                	<img src="${recipe.image_url}" alt="${recipe.title}">
            	</figure>
            	<div class="results__data">
                	<h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                	<p class="results__author">${recipe.publisher}</p>
            	</div>
        	</a>
    	</li>
	`;
	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};


//type: 'prev' or 'next'
const createButton = (page, typeOfButton) => `
    <button class="btn-inline results__btn--${typeOfButton}" data-goto=${typeOfButton === 'prev' ? page - 1  :  page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${typeOfButton === 'prev' ? 'left' :  'right'}"></use>
        </svg>
        <span>Page ${typeOfButton === 'prev' ? page - 1  :  page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
	const pages = Math.ceil(numResults / resultsPerPage);

	let button;
	if (page === 1 && pages > 1) {
		//Only button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		//Both buttons
		button = `
			${createButton(page, 'prev')}
			${createButton(page, 'next')}
		`;
	} else if (page === pages && pages > 1) {
		//Only button to go to previous page
		button = createButton(page, 'prev');
	}

	elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
	//Render results of current page
	const start = (page - 1) * resultsPerPage;
	const end = page * resultsPerPage;
	//.slice parameters are the start of array and end
	recipes.slice(start, end).forEach(renderRecipe);

	//Render pagination buttons
	renderButtons(page, recipes.length, resultsPerPage);


};
























