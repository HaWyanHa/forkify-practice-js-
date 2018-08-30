/*jshint esversion: 6*/
import str from './models/Search';

//import {add as a, multiply as m, ID} from './views/searchViews';

import * as searchViews from './views/searchViews';

console.log(`Using imported functions ${searchViews.add(searchViews.ID, 2)} and ${searchViews.multiply(3, 4)}. ${str}`);