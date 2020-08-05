import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Question, QuestionsService } from '../services/question.service';

@Component({
  selector: 'ef-generated-form',
  templateUrl: './generated-form.component.html',
  styleUrls: ['./generated-form.component.css']
})
export class GeneratedFormComponent implements OnInit {

  questionsForm: FormGroup;
  questions: Question[];
  showSummary = false;
  answerSummary: any;
  
  constructor(private questionService: QuestionsService) { 
    this.questionsForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.questions = this.questionService.loadQuestions();

    for (const question of this.questions) {
      const formControl = this.createControl(question);
      this.questionsForm.addControl(question.id, formControl);
    }
  }

  private createControl(question: Question): FormControl {
    const validators = [];
    if (question.required) {
      validators.push(Validators.required);
    }
    return new FormControl('', validators);
  }

  saveForm(formValue: any) {
    console.log(formValue);
    this.questionService.saveAnswers(formValue);
    this.answerSummary = this.questions.map(question => {
      return {
        text: question.text,
        answer: formValue[question.id]
      }
    });
    console.log(this.answerSummary);
    this.showSummary = true;
  }

  backToForm() {
    this.showSummary = false;
    this.questionsForm.reset();
  }
}
