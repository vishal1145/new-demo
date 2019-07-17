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
  emailColor = "red"
  loader = false;
  username: any = '';
  password : any = '';
  checkvalue: boolean = false;
  correctEmail: boolean = true;
  usernameCheck: boolean = false;
  checkValidation: boolean = false;
  userNameSelect: boolean = false;
  userNameWrong: boolean = false;
  checkPassword: boolean = false;
  regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
  phoneNumber = new RegExp(/^[0-9]+$/);

  constructor(private router: Router, 
    public toastr: ToastrService) {
  }

  ngOnInit() { }

  UserNameCheck() {
    this.usernameCheck = false
    this.correctEmail = true
    this.checkValidation = false
    this.userNameSelect = false
    this.userNameWrong = false
    //this.checkPassword = false
    this.emailColor = "red";
    if (!this.phoneNumber.test(this.username)) {
      //this.emailColor = "#5c6873";
      var checkeamil = this.regex.test(this.username)
      if (!checkeamil) {
        this.emailColor = "red";
      }
      else {
        this.emailColor = "#5c6873";
      }
    } else {
      if ((this.username).toString().length > 10) {
        var username = (this.username).substring(0, 10);// (this.username).substring(0, (this.username).toString().length - 1)
        this.username = username
        return false;
      }
      else if ((this.username).toString().length == 10) {
        this.emailColor = "#5c6873";
        this.checkvalue = true
      } else {
        this.emailColor = "red";
      }
      //this.emailColor = "red";
    }
  }
  UserPasswordCheck() {
    this.checkValidation = false
    //this.userNameSelect = false
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
  }

  async login() {
    //this.userNameSelect = false
    //this.usernameCheck = false
    //this.checkPassword = false
    debugger
    if (this.username !== '' && this.password !== '' && this.emailColor == "#5c6873") {
      this.loader = true
      //if (!this.phonenumber.test(this.username)) {
      //  var checkeamil = this.emailregex.test(this.username)
      //  if (!checkeamil) {
      //    return this.correctemail = false
      //  }
      //}
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
        this.username = ''
        this.password = ''
        //this.toastr.error("", 'Wrong username and password');
        this.loader = false
      }
    }
    else {
      //this.checkValidation = true;
      if (this.username == '' && this.password == '') {
        this.userNameSelect = true
        this.checkPassword = true
      }
     
      else if (this.username !== '' && this.emailColor == "red" && this.password == '') {
        this.usernameCheck = true
        this.checkPassword = true
      }
      else if (this.username !== '' && this.emailColor == "red" && this.password !== '') {
        this.usernameCheck = true
      }
      else if (this.username == '' && this.password !== '') {
        this.userNameSelect = true
      }
      else if (this.password == '' && this.username == '') {
        this.checkPassword = true
      }
     
      //else {
      //  this.checkPassword = true
      //  this.userNameSelect = true
      //}

      //if (this.username == '' && this.emailColor !== "red") {
      //  this.userNameSelect = true
      //   //this.toastr.error("", "Please Enter Password")
      //}
      //if (this.username !== '' && this.emailColor !== "red") {
      //  this.usernameCheck = true
      //  //this.toastr.error("", "Please Enter Password")
      //}
      //if (this.username == '' && this.emailColor == "red") {
      //  this.userNameSelect = true
      //  //this.toastr.error("", "Please Enter Password")
      //}
      //else if (this.password == '' ) {
      //  this.checkPassword = true
      //}
      //else if (this.password !== '' ) {
      //  this.userNameSelect = true
      //}
      //else if (this.emailColor == "red" ) {
      //  this.usernameCheck = true
      //}
      //else {
      //  this.checkPassword = true
      //  this.userNameSelect = true
      //   //this.toastr.error("", "Please Enter Email / Phone No. and Password")
      //}
    }
  }

  gotoRegister() {
    //var self = this
    //self.router.navigate[("auth/signup")]
    window.location.href = "/auth/signup";
  }
} 
