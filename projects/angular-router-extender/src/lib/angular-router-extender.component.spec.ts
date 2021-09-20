import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularRouterExtenderComponent } from './angular-router-extender.component';

describe('AngularRouterExtenderComponent', () => {
  let component: AngularRouterExtenderComponent;
  let fixture: ComponentFixture<AngularRouterExtenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularRouterExtenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularRouterExtenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
