import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl(''),
  };

  // form validation conditions: 
  emailInUse = false;
  passwordsMatch = false;
  passwordCheckError: any = {
    length: false,
    digit: false,
    uppercase: false,
    lowercase: false,
  };
  passwordOK = false;

  progressBarValue = 0;
  errorMessage = {
    email: '',
    password: '',
    passwordRepeat: '',
    api: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form.email.valueChanges.subscribe((email: string) => {
      this.checkEmail()
    });
    this.form.password.valueChanges.subscribe((password: string) => {
      this.checkPassword()
      this.updateProgressBar()
    });
  }

  checkPassword() {
    let str = this.form.password.value;

    // check if password contains digits
    let matchDigits = str.match(/(\d+)/);
    matchDigits !== null
      ? (this.passwordCheckError.digit = true)
      : (this.passwordCheckError.digit = false);

    // check if password contains lowercase letters
    let matchLowercase = str.match(/[a-z]/g);
    matchLowercase !== null
      ? (this.passwordCheckError.lowercase = true)
      : (this.passwordCheckError.lowercase = false);

    // check if password contains upeprcase letters
    let matchUppercase = str.match(/[A-Z]/g);
    matchUppercase !== null && matchUppercase.length > 0
      ? (this.passwordCheckError.uppercase = true)
      : (this.passwordCheckError.uppercase = false);

    // check if password is shorter than 8 characters
    str.length < 8
      ? (this.passwordCheckError.length = false)
      : (this.passwordCheckError.length = true);

    for (let condition in this.passwordCheckError) {
      if (this.passwordCheckError[condition]) {
        this.passwordOK = true;
      } else {
        this.passwordOK = false;
        this.renderErrorMessage({
          msg: 'Hasło musi zawierać minimum 1 cyfrę, 1małą literę, 1 dużą literę i składać się z co najmniej 8 znaków.',
          type: 'password',
        });
        break;
      }
    }
  }

  updateProgressBar() {
    const conditionsAmount:number = Object.keys(this.passwordCheckError).length;
    let conditionsMet:number = 0;
    for (let condition in this.passwordCheckError) {
      if (this.passwordCheckError[condition]) conditionsMet ++;
    }
    this.progressBarValue = conditionsMet / conditionsAmount * 100;
  }

  checkIfPasswordsMatch() {
    if (this.form.password.value !== this.form.passwordRepeat.value) {
      this.passwordsMatch = false;
      this.renderErrorMessage({
        msg: 'Podane hasła się nie zgadzają',
        type: 'passwordRepeat',
      });
    } else {
      this.passwordsMatch = true;
      this.form.passwordRepeat.status = 'VALID';
    }
  }

  // checks if the email address is already in the database
  checkEmail() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        for (let i of data) {
          if (i.email === this.form.email.value) {
            this.emailInUse = true;
            this.renderErrorMessage({
              msg: 'Email jest zajęty',
              type: 'email',
            });
            break;
          } else {
            this.emailInUse = false;
          }
        }
      },
      error: (err) => {
        this.renderErrorMessage({msg: err, type:'api'})
      },
    });
  }

  onSubmit() {
    const { email, password } = this.form;
    // submits form only if all form validation conditions are met
    if (
      this.form.email.status === 'VALID' &&
      !this.emailInUse &&
      this.passwordOK &&
      this.passwordsMatch
    ) {
      this.authService.register(email.value, password.value).subscribe({
        next: (data) => {
          this.router.navigate(['/login'], {
            queryParams: { email: email.value },
          });
        },
        error: (err) => {
          this.renderErrorMessage({
            msg: err.error,
            type: 'api',
          });
          this.errorMessage.api = err.error;
        },
      });
    } 
  }

  renderErrorMessage(err: { msg: string; type: string }) {
    switch (err.type) {
      case 'email':
        this.errorMessage.email = err.msg;
        this.form.email.status = 'INVALID';
        break;
      case 'password':
        this.errorMessage.password = err.msg;
        this.form.password.status = 'INVALID';
        break;
      case 'passwordRepeat':
        this.errorMessage.passwordRepeat = err.msg;
        this.form.passwordRepeat.status = 'INVALID';
        break;
      default:
        this.errorMessage.api = err.msg;
        break;
    }
  }
}
