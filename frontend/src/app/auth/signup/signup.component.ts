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
  allfieldsCheck: boolean = false;
  emailIdExist: boolean = false;
  phoneNumberExist: boolean = false;
  roleSelect: String = "step1";
  isotp: boolean  = false;
  passwordCheck: boolean = false;
  emailCheck: boolean = false;
  mobilenumberCheck: boolean = false;
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
  gotoContinue() {
    this.roleSelect = "step2"
  }

  checkNumberDigit(mobileNo) {
    if (mobileNo.toString().length > 10) {
      return false;
    }
  }

  SelctRole(role) {
    $("#busibess").removeClass("selectRole");
    $("#customer").removeClass("selectRole");
    if (role == 'BUSINESS') {
      $("#busibess").addClass("selectRole");

    } else if (role == 'CUSTOMER'){
      $("#customer").addClass("selectRole");
    }
   
    this.role = role
    //this.roleSelect = false
  }
  passwordValiadtion() {
    this.allfieldsCheck = false
    this.passwordCheck = false
  }
  emailValiadtion() {
    this.emailCheck = false
    this.allfieldsCheck = false
    this.emailIdExist = false
    this.emailColor = "red";
    if (this.regex.test(this.user_name)) {
      this.emailColor = "#5c6873";
    } else {
      this.emailColor = "red";
    }
  }

  mobileNumberCheck(mobile) {
    this.mobilenumberCheck = false
    this.allfieldsCheck = false
    this.phoneNumberExist = false
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
          //this.toastr.success("", 'Create account successfully');
          
          //window.location.href = "/auth/login";

          this.roleSelect = "step3";
          //this.mobile_no = ''
          //this.user_name = ''
          //this.password = ''
        }
        else {
          this.toastr.error("", 'Something went to wrong');
        }
      }
      else if (checkEmailTest) {
        this.emailIdExist = true
        //this.toastr.error("This email Id already exist . Please enter other email Id")
      }
      else if (checkMobileNo) {
        this.phoneNumberExist = true
        //this.toastr.error("This Mobile No already exist . Please enter other mobile No")
      }
      //else {
      //  this.toastr.error("You have already registered")
      //}
    }
    else if (this.mobile_no && this.user_name) {
      this.passwordCheck = true
    }
    else if (this.mobile_no && this.password) {
      this.emailCheck = true
    }
    else if (this.user_name && this.password){
      this.mobilenumberCheck = true
    }
    else if (this.mobile_no) {
      this.passwordCheck = true
      this.emailCheck = true
    }
    else if (this.user_name) {
      this.passwordCheck = true
      this.mobilenumberCheck = true
    }
    else if (this.password) {
      this.mobilenumberCheck = true
      this.emailCheck = true
    }
    else {
      this.mobilenumberCheck = true
      this.emailCheck = true
      this.passwordCheck = true
      //this.toastr.error("",'All fields are mandatory')
    }

  }

  gotoLogin() {
    //this.router.navigate[("auth/login")]
    window.location.href = "/auth/login";
  }

} 
