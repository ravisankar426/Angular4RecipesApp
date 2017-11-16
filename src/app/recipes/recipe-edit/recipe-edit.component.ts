import { TryUpdateRecipeById } from './../store/recipe.actions';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {FormGroup,FormControl,FormArray,Validators} from '@angular/forms';
import {Recipe} from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})

export class RecipeEditComponent implements OnInit {
  id:number;
  editMode:boolean=false;
  recipeForm:FormGroup;
  recipe:Recipe;
 
  constructor(private route:ActivatedRoute,
    private router:Router,
    private store:Store<fromRecipe.FeatureState>) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.id=+params['id'];
      this.editMode=params['id']!=null;
      this.InitForm();
    });

    this.store.select('recipes').subscribe((recipeState:fromRecipe.State)=>{
      if(this.id>0){
        //recipeState.recipes.forEach((recipe:Recipe)=>{
          this.recipe=recipeState.selectedRecipe;
        //})
      }      
      this.InitForm();
    });
  }

  private InitForm(){
    let id=0;
    let _id='';
    let name='';
    let imagePath='';
    let description='';
    let ingredients=new FormArray([]);

    if(this.editMode){
      this.store.select('recipes')
      .take(1)
      .subscribe((recipeState:fromRecipe.State)=>{
        // recipeState.recipes.forEach((recipe:Recipe) => {
        //   if(recipe.id===this.id)
            this.recipe=recipeState.selectedRecipe;
        //});
      });
      id=this.id;
      _id=this.recipe._id;
      name=this.recipe.name;
      imagePath=this.recipe.imagePath;
      description=this.recipe.description;
      if(this.recipe['ingredients']){
        for(let ingredient of this.recipe.ingredients){
          ingredients.push(new FormGroup({
            'Name':new FormControl(ingredient.Name,Validators.required),
            'Amount':new FormControl(ingredient.Amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
        }
      }
    }

    this.recipeForm=new FormGroup({
      'id':new FormControl(id),
      '_id':new FormControl(_id),
      'name':new FormControl(name,Validators.required),
      'imagePath':new FormControl(imagePath,Validators.required),
      'description':new FormControl(description),
      'ingredients':ingredients
    });
  }

  onSubmit(){
    if(this.editMode){
      this.store.dispatch(new RecipeActions.TryUpdateRecipeById({index:this.id,updatedRecipe:this.recipeForm.value}));
    }
    else{
      this.store.dispatch(new RecipeActions.TryAddRecipe(this.recipeForm.value));
    }
    this.cancel();  
  }

  cancel(){
    if(this.editMode)    
      this.router.navigate(['recipes',this.id]);    
    else
      this.router.navigate(['/recipes']);
  }

  addIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'Name':new FormControl(null,[Validators.required]),
      'Amount':new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  deleteIngredient(ingredientIndex:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(ingredientIndex);    
  }

}
