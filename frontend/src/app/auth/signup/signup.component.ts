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
  wrongMobileNo: boolean = false;
  wrongEmail: boolean = false;
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
    this.roleSelect = "step2"
  }
  passwordValiadtion() {
    this.allfieldsCheck = false
    this.passwordCheck = false
  }
  emailValiadtion() {
    this.wrongEmail = false
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
  otpColor=''

  OTP_VALUE = 99999999999999999999;
  otpValiadtion(){
    debugger;
    this.otpWrong =false;
    this.optCheck =false;
    if ((this.user_otp).toString().length == 4) {
      this.otpColor = "#5c6873";
    } else {
      this.otpColor = "red";
    }
  }

  mobileNumberCheck(mobile) {
    this.wrongMobileNo = false
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

  user_otp='';
  optCheck=false;
  otpWrong =false;


  sendOTP(moobileno){
    // moobileno = 9953813100;
    var url = (window as any).APIBASE + "sendotp/"+moobileno;
    return new Promise((resolve, reject) => {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": url,
      "method": "GET",
      "headers": {}
    }
    
    $.ajax(settings).done(function (response) {
      resolve(response);
    }).catch((err) => {
      resolve({issuccess : false});
    });
  })
  }
  async verify(){
    
    this.otpWrong =false;
    this.optCheck =false;
    if (this.user_otp) {
      if(this.user_otp == this.otpcode.toString()){

        let getSignUpData = await ithours_client.add("User", this.signupData);
        debugger
        if (getSignUpData.apidata && getSignUpData.apidata.Data) {
          this.toastr.success("", 'Create account successfully, please login with admin to verify registration');
          
          setTimeout(() => {
            window.location.href = "/auth/login";  
          }, 3000);
          
          //this.roleSelect = "step1";
          this.mobile_no = ''
          this.user_name = ''
          this.password = ''
        }
        else {
          this.toastr.error("", 'Something went to wrong');
        }

      }else
      {
        this.otpWrong =true;
      }
    }
    else {
      this.optCheck = true;
    }
  }
  signupData:any ={};
  otpcode = 99999999999999999999999;
  async register() {
    if (this.mobile_no !== '' && this.user_name !== '' && this.password !== '' && this.emailColor !== "red" && this.mobileColor !== "red") {
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
        this.signupData = {
          phone: this.mobile_no,
          email: this.user_name,
          password: this.password,
          role: this.role
        }
        // let getSignUpData = await ithours_client.add("User", signupData);
        // debugger
        // if (getSignUpData.apidata && getSignUpData.apidata.Data) {
        //   //this.toastr.success("", 'Create account successfully');
          
        //   //window.location.href = "/auth/login";

        //   this.roleSelect = "step3";
        //   //this.mobile_no = ''
        //   //this.user_name = ''
        //   //this.password = ''
        // }
        // else {
        //   this.toastr.error("", 'Something went to wrong');
        // }
      

        var isotpsend:any = await this.sendOTP(this.mobile_no);
if(isotpsend.issuccess){
  this.otpcode = isotpsend.otp;
  this.roleSelect = "step3";
}else {
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

    if (this.user_name == '' && this.mobile_no == '' && this.password == '') {
      this.emailCheck = true
      this.mobilenumberCheck = true
      this.passwordCheck = true
    }
    else if (this.user_name == ''){
      this.emailCheck = true
    }
    else if (this.user_name == '' && this.mobile_no == '') {
      this.emailCheck = true
      this.mobilenumberCheck = true
    }
    else if (this.user_name == '' && this.password == '') {
      this.emailCheck = true
      this.passwordCheck = true
    }

    else if (this.mobile_no == '') {
      this.mobilenumberCheck = true
    }
    else if (this.mobile_no == '' && this.password == '') {
      this.mobilenumberCheck = true
      this.passwordCheck = true
    }

    else if (this.password == '') {
      this.passwordCheck = true
    }
    else if (this.emailColor == "red" && this.mobileColor == "red"){
      this.wrongEmail = true
      this.wrongMobileNo = true
    }

    else if (this.emailColor == "red"){
      this.wrongEmail = true
    }

    else if (this.mobileColor == "red") {
      this.wrongMobileNo = true
    }

  }

  gotoLogin() {
    //this.router.navigate[("auth/login")]
    window.location.href = "/auth/login";
  }

} 
