import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from './story.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CoreService } from '../core/core.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-ai-chatbot-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  storyForm: FormGroup;
  storyFormFields: any;

  storyTypes;
  storyTypesArray;
  message;

  @Input()
  afterSave;

  @Input()
  story;

  constructor(
    public fb: FormBuilder,
    public coreService: CoreService,
    public storyService: StoryService) {
  }

  ngOnInit() {
    this.storyTypes = StoryService.storyTypes;
    this.storyTypesArray = Object.keys(this.storyTypes);
    this.storyFormFields = {
      _id: [''],
      storyName: [''],
      intentName: [''],
      speechResponse: [''],
      jsonData: [''],
      apiDetails: this.fb.group({
        apiTrigger: [''],
        isJson: [''],
        url: [''],
        requestType: [''],
      }),
      parameters: this.fb.array(
        this.story && this.story.parameters ? this.story.parameters.map(n => {
          return this.initParameter(n);
        }) : []
      )
    };
    this.storyForm = this.fb.group(this.storyFormFields);
    if (this.story) {
      this.coreService.setDataForm(this.storyForm, this.storyFormFields, this.story)
    }
  }

  addParameter() {
    const control = <FormArray>this.storyForm.controls['parameters'];
    control.push(this.initParameter());
  }

  initParameter(parameter = null) {
    const fields = {
      paramName: [''],
      paramEntityType: [''],
      paramRequired: [''],
      prompt: [''],
      _id: ['']
    };
    const g = this.fb.group(fields);
    if (parameter) {
      // setdataform
    }
    return g;
  }

  deleteParameter(i) {
    const control = <FormArray>this.storyForm.controls['parameters'];
    control.removeAt(i);
  }

  save() {
    const form = this.storyForm.value;
    if (form._id && form._id.$oid) {
      form._id = form._id.$oid;
    }

    this.storyService.saveStory(form)
      .then(c => {
        this.message = 'Story created!';
        if (this.afterSave) {
          this.afterSave(c);
        }
      })
  }

}
