import { Component, OnInit, ElementRef, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
//import { _ } from "underscore";
declare var $: any;
declare var ithours_client: any;
@Component({
  selector: "app-signup-cmp",
  templateUrl: "./signup.component.html"
})
export class SignUpComponent implements OnInit {
  mobileColor = "red";
  emailColor = "red";
  roleSelect: boolean = true;
  loader = false;
  role: any;
  user_name: any = '';
  mobile_no: any = '';
  password: any = '';
  allUsersData: any = [];
  regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
  //phoneNumber = new regex(/^[0-9]+$/);

  constructor(private router: Router, 
    public toastr: ToastrService) {
    this.getAllUsers();
  }

  ngOnInit() { }
  async getAllUsers() {
    let AllUsers = await ithours_client.get("User", {});
    if (AllUsers.apidata.Data){
      this.allUsersData = AllUsers.apidata.Data
    }

  }

  SelctRole(role) {
    this.role = role
    this.roleSelect = false
  }
  emailValiadtion() {
    this.emailColor = "red";
    if (this.regex.test(this.user_name)) {
      this.emailColor = "#5c6873";
    } else {
      this.emailColor = "red";
    }
  }

  mobileNumberCheck(mobile) {
    this.mobile_no = mobile
    if ((this.mobile_no).toString().length == 10) {
      this.mobileColor = "#5c6873";
    } else {
      this.mobileColor = "red";
    }
  }
  async register() {
    if (this.mobile_no && this.user_name && this.password) {
      var checkEmailTest = false
      var checkMobileNo = false
      for (var checkEmail = 0; checkEmail < this.allUsersData.length; checkEmail++) {
        if (this.allUsersData[checkEmail].email == this.user_name) {
          checkEmailTest = true
        }
        else if (this.allUsersData[checkEmail].phone == this.mobile_no) {
          checkMobileNo = true
        }
      }
      if (!checkEmailTest && !checkMobileNo) {
        var signupData = {
          phone: this.mobile_no,
          email: this.user_name,
          password: this.password,
          role: this.role
        }
        let getSignUpData = await ithours_client.add("User", signupData);
        debugger
        if (getSignUpData.apidata && getSignUpData.apidata.Data) {
          this.toastr.success("", 'Create account successfully');
          window.location.href = "/auth/login";
          //this.mobile_no = ''
          //this.user_name = ''
          //this.password = ''
        }
        else {
          this.toastr.error("", 'Something went to wrong');
        }
      }
      else if (checkEmailTest) {
        this.toastr.error("This email Id already exist . Please enter other email Id")
      }
      else if (checkMobileNo) {
        this.toastr.error("This Mobile No already exist . Please enter other mobile No")
      }
      //else {
      //  this.toastr.error("You have already registered")
      //}
    }
    else {
      this.toastr.error("",'All fields are mandatory')
    }

  }

  gotoLogin() {
    //this.router.navigate[("auth/login")]
    window.location.href = "/auth/login";
  }

} 
