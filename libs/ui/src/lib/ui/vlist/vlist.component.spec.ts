import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VlistComponent } from './vlist.component';

describe('VlistComponent', () => {
  let component: VlistComponent;
  let fixture: ComponentFixture<VlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
