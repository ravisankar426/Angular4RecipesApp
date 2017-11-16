

import { Action } from '@ngrx/store';
import { Recipe } from './../recipe.model';

export const SET_RECIPES='SET_RECIPES';
export const TRY_ADD_RECIPE='TRY_ADD_RECIPE';
export const ADD_RECIPE='ADD_RECIPE';
export const DELETE_RECIPE='DELETE_RECIPE';
export const FETCH_RECIPES='FETCH_RECIPES';
export const SAVE_RECIPES='SAVE_RECIPES';
export const SET_SELECTED_RECIPE_ID='SET_SELECTED_RECIPE_ID';
export const SET_SELECTED_RECIPE='SET_SELECTED_RECIPE';
export const TRY_UPDATE_RECIPE_BY_ID="TRY_UPDATE_RECIPE_BY_ID";
export const UPDATE_RECIPE_BY_ID="UPDATE_RECIPE_BY_ID";

export class FetchRecipes implements Action{
    readonly type=FETCH_RECIPES;
}

export class SaveRecipes implements Action{
    readonly type=SAVE_RECIPES;
}

export class SetRecipes implements Action{
    readonly type=SET_RECIPES;
    constructor(public payload:Recipe[]){

    }
}

export class TryAddRecipe implements Action{
    readonly type=TRY_ADD_RECIPE;
    constructor(public payload:Recipe){

    }
}

export class AddRecipe implements Action{
    readonly type=ADD_RECIPE;
    constructor(public payload:Recipe){
        
    }
}

export class DeleteRecipe implements Action{
    readonly type=DELETE_RECIPE;
    constructor(public payload:number){

    }
}

export class SetSelectedRecipeId implements Action{
    readonly type=SET_SELECTED_RECIPE_ID;
    constructor(public payload:number){

    }
}

export class SetSelectedRecipe implements Action{
    readonly type=SET_SELECTED_RECIPE;
    constructor(public payload:Recipe){

    }
}

export class TryUpdateRecipeById implements Action{
    readonly type=TRY_UPDATE_RECIPE_BY_ID;
    constructor(public payload:{index:number,updatedRecipe:Recipe}){

    }
}

export class TryUpdateRecipe implements Action{
    readonly type=UPDATE_RECIPE_BY_ID;
}

export type RecipeActions= SetRecipes |
                            AddRecipe | 
                            TryAddRecipe | 
                            DeleteRecipe | 
                            FetchRecipes | 
                            SaveRecipes | 
                            SetSelectedRecipeId |
                            SetSelectedRecipe |
                            TryUpdateRecipeById | 
                            TryUpdateRecipe;