

import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/switchMap';
import {fromPromise} from 'rxjs/observable/fromPromise';
import * as RecipeActions from  './recipe.actions';
import { Common } from './../../common';
import { Recipe } from './../recipe.model';
import * as firebase from 'firebase';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects{
    
    common:Common=new Common();
    recipes:Recipe[];
    recipe:Recipe;
    token:string;

    @Effect()
    fetchRecipes=this.actions$
    .ofType(RecipeActions.FETCH_RECIPES)
    .switchMap((action:RecipeActions.FetchRecipes)=>{
       return fromPromise( firebase.auth().currentUser.getIdToken());        
    })
    .switchMap((token:string)=>{
         //return this.http.get(this.common.webAPIUrl+'?auth='+token);
        return this.http.get('http://localhost:3000/api/recipes');
    })
    .switchMap((response:Response)=>{
        this.recipes=[];
        const recipes:Recipe[]= response.json();
        var keys=Object.keys(recipes);
        keys.forEach((key)=>{
            this.recipe=new Recipe();
            this.recipe=recipes[key];
            this.recipe.guid=key;
            this.recipes.push(this.recipe);
          });
          return this.recipes;
    })
    .mergeMap(()=>{
        return[{
            type:RecipeActions.SET_RECIPES,
            payload:this.recipes
        }];
    });

    @Effect()
    getRecipeById=this.actions$
    .ofType(RecipeActions.SET_SELECTED_RECIPE_ID)
    .map((action:RecipeActions.SetSelectedRecipeId)=>{
        return action.payload
    })
    .switchMap((action:number)=>{
        return this.http.get('http://localhost:3000/api/recipe/'+action);        
    })
    .mergeMap((response:Response)=>{
        return [{
            type:RecipeActions.SET_SELECTED_RECIPE,
            payload:response.json()
        }];
    });

    @Effect()
    updateRecipeById=this.actions$
    .ofType(RecipeActions.TRY_UPDATE_RECIPE_BY_ID)
    .map((action:RecipeActions.TryUpdateRecipeById)=>{
        return action.payload
    })
    .switchMap((updatedRecipeData:{index:number,updatedRecipe:Recipe})=>{
        return this.http.put('http://localhost:3000/api/recipe/update/'+updatedRecipeData.index,updatedRecipeData.updatedRecipe);        
    })
    .switchMap((response:Response)=>{
        return this.http.get('http://localhost:3000/api/recipe/'+response.json().id);        
    })
    .mergeMap((response:Response)=>{
        return[{
            type:RecipeActions.SET_SELECTED_RECIPE,
            payload:response.json()
        }];
    });

    @Effect()
    addRecipe=this.actions$
    .ofType(RecipeActions.TRY_ADD_RECIPE)
    .map((action:RecipeActions.TryAddRecipe)=>{
        return action.payload
    })
    .switchMap((recipe:Recipe)=>{
        return this.http.post('http://localhost:3000/api/recipe/add/',recipe);        
    })
    .mergeMap((response:Response)=>{
        console.log(response.json());
        return[{
            type:RecipeActions.ADD_RECIPE,
            payload:response.json()
        }];
    });

    @Effect({dispatch:false})
    saveRecipes=this.actions$
    .ofType(RecipeActions.SAVE_RECIPES)
    .switchMap((action:RecipeActions.SaveRecipes)=>{
        return fromPromise( firebase.auth().currentUser.getIdToken()); 
    })
    .switchMap((token:string)=>{
        this.store.select('recipes')
        .take(1)
        .subscribe((recipeState:fromRecipe.State)=>{
            this.recipes=recipeState.recipes;
        })
        return this.http.put(this.common.webAPIUrl+'?auth='+token,this.recipes);
    })
    .do(()=>{
        this.router.navigate(['/recipes'])
    });

    constructor(private actions$:Actions,
        private http:Http,
        private store:Store<fromRecipe.FeatureState>,
        private router:Router){

    }
}