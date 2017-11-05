
import { Action } from '@ngrx/store';
import {Recipe} from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducers';
import { ShoppingListItem } from './../../shopping-list/shoppingList.model';
export interface FeatureState extends fromApp.AppState{
    recipes:State
}

export interface State{
    recipes:Recipe[],
    selectedRecipeId:number,
    selectedRecipe:Recipe
}

const initialState:State={    
    recipes:[],
    selectedRecipeId:-1,
    selectedRecipe:new Recipe()
};

export function RecipeReducers(state=initialState,action:RecipeActions.RecipeActions){

    switch(action.type){
        case RecipeActions.SET_RECIPES:
            return{
                ...state,                
                recipes:[...action.payload]
            };
        case RecipeActions.SET_SELECTED_RECIPE_ID:
            return{
                    ...state,                
                    selectedRecipeId:action.payload
            };
        case RecipeActions.SET_SELECTED_RECIPE:
            return{
                    ...state,                
                    selectedRecipe:action.payload
            };
        case RecipeActions.ADD_RECIPE:
            const maxId=state.recipes.length+1;
            const newRecipe=action.payload;
            newRecipe.id=maxId;
            return{
                ...state,
                recipes:[...state.recipes,newRecipe]
            };
        case RecipeActions.UPDATE_RECIPE_BY_ID:
            return state;
        case RecipeActions.DELETE_RECIPE:
            var oldRecipes:Recipe[]=[];
            state.recipes.forEach((recipe:Recipe)=>{
                if(recipe.id!=action.payload){
                    oldRecipes.push(recipe);
                }
            });
            return{
                ...state,
                recipes:oldRecipes
            };
        default:        
            return state;
    }

}