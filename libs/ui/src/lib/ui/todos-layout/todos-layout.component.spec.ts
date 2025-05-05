import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosLayoutComponent } from './todos-layout.component';

describe('TodosLayoutComponent', () => {
  let component: TodosLayoutComponent;
  let fixture: ComponentFixture<TodosLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
