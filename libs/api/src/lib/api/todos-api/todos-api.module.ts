import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosApiService } from './todos-api.service';

@NgModule({
  declarations: [],
  providers: [TodosApiService],
  imports: [CommonModule],
})
export class TodosApiModule {}
