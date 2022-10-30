import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
})
export class ResetPasswordComponent implements OnInit {
  form: any = {
    email: new FormControl('', [Validators.required, Validators.email]),
  };
  errorMessage = '';
  resetDone = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { email } = this.form;
    if (this.form.email.status == 'VALID') {
      this.authService.resetPassword(email.value).subscribe({
        next: (data) => {
          this.resetDone = true;
        },
        error: (err) => {
          // this.errorMessage = err.error.message;
          // this.isLoginFailed = true;
          if (err.status == 400) {
            this.errorMessage = 'Nie znaleziono użytkownika';
          }
          if (err.status == 202) {
            this.resetDone = true;
          }
        },
      });
    }
  }
}
