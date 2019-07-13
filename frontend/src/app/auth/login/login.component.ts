import { Component, OnInit, ElementRef, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
//import { _ } from "underscore";
declare var $: any;
declare var ithours_client: any;
@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  loader = false;
  username = null;
  password = null;
  correctEmail: boolean = true;
  checkValidation: boolean = false;
  userNameSelect: boolean = true;
  userNameWrong: boolean = false;
  checkPassword: boolean = false;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/
  phoneNumber = new RegExp(/^[0-9]+$/);

  constructor(private router: Router, 
    public toastr: ToastrService) {
  }

  ngOnInit() { }

  UserNameCheck() {
    this.correctEmail = true
    this.checkValidation = false
    this.userNameSelect = true
    this.userNameWrong = false
    this.checkPassword = false
  }
  UserPasswordCheck() {
    this.checkValidation = false
    this.userNameSelect = true
    this.userNameWrong = false
    this.checkPassword = false
  }
  async signup() {
    var signupData = {
      phone: '9758894732',
      email: 'demo@test.com',
      password:'1234'
    }
    let staffData = await ithours_client.add("User", signupData);
    debugger

  }

  async login() {
    // localStorage.setItem("USER", JSON.stringify({_id:"sdsadsa"}))
    // this.router.navigate(["/pages/staffing"]);

    if (this.username && this.password) {
      this.loader = true

      if (!this.phoneNumber.test(this.username)) {
        var checkEamil = this.emailRegex.test(this.username)
        if (!checkEamil) {
          return this.correctEmail = false
          //return  this.toastr.error("", "Please enter your correct email address")
        }
      }
      let getUser = await ithours_client.get('User', { email: this.username, password: this.password })
      if (getUser.apidata.Data && getUser.apidata.Data.length == 0) {
        let getUser1 = await ithours_client.get('User', { phone: Number(this.username), password: this.password })
        getUser.apidata.Data = getUser1.apidata.Data
      }
      if (getUser.apidata && getUser.apidata.Data && getUser.apidata.Data.length > 0) {
        window.localStorage.setItem('USER', JSON.stringify(getUser.apidata.Data[0]))
        if (getUser.apidata.Data[0].role == 'ADMIN') {
        this.router.navigate(["/pages/users"])
        }
        else if (getUser.apidata.Data[0].role == 'CUSTOMER') {
          this.router.navigate(["/pages/customer"])
        }
        else if (getUser.apidata.Data[0].role == 'BUSINESS') {
          this.router.navigate(["/pages/business"])
        }
      }
      else {
        this.userNameWrong = true
        //this.toastr.error("", 'Wrong username and password');
        this.loader = false
      }
    }
    else {
      this.checkValidation = true;
      if (this.username && !this.password) {
        this.checkPassword = true
         //this.toastr.error("", "Please Enter Password")
      }
      else {
        this.userNameSelect = false
         //this.toastr.error("", "Please Enter Email / Phone No. and Password")
      }
    }
  }

  gotoRegister() {
    debugger
    //var self = this
    //self.router.navigate[("auth/signup")]
    window.location.href = "/auth/signup";
  }
} 
