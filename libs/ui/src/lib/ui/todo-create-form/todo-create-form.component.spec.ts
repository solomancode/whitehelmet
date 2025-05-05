import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoCreateFormComponent } from './todo-create-form.component';

describe('TodoCreateFormComponent', () => {
  let component: TodoCreateFormComponent;
  let fixture: ComponentFixture<TodoCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
