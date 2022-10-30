import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  form: any = {
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: string = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.currentUser = this.tokenStorage.getUser().email;
    }

    const params = new URL(location.href).searchParams;
    const emailParam = params.get('email')

    if (emailParam) {
      this.form.email = new FormControl(`${emailParam}`);
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.login(email.value, password.value).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.currentUser = this.tokenStorage.getUser().email;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  logout(): void {
    this.tokenStorage.signOut();
  }

  getErrorMessage() {
    if (this.form.email.hasError('required')) {
      return 'Wprowadź login / email';
    }

    return this.form.email.hasError('email')
      ? 'To nie jest poprawny adres email'
      : '';
  }
}
