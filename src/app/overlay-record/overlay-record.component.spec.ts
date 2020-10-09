import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayRecordComponent } from './overlay-record.component';

describe('OverlayRecordComponent', () => {
  let component: OverlayRecordComponent;
  let fixture: ComponentFixture<OverlayRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
