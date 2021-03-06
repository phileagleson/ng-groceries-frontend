import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { ErrorService } from '../../services/error.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  errors: string[] = []

  constructor(private errorService: ErrorService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    const query = `
    query LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        id
        name
        email
      }
    }
    `
    const variables = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    if (this.loginForm.valid) {
      this.authService.login(query, variables).subscribe((res) => {
        if (res.body.data.loginUser) {
          this.router.navigate(['groceries'])
        } else {
          for (const error of res.body.errors) {
            const message = error.message
            this.errorService.showError(message)
          }
        }
      })
    }
  }
}
