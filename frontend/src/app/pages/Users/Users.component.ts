import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { RlTagInputModule } from 'angular2-tag-input';
import { Angular2CsvModule } from 'angular2-csv';
declare var $: any;
declare var AWS: any;
declare var ithours_client: any
declare var xlsExport: any;
declare var encodeURI: any;

@Component({
  selector: 'pages-Users-cmp',
  templateUrl: './Users.component.html'
})

export class UsersComponent implements OnInit {
  emailColor = "red";
  mobileColor = "red";
  emailId: any;
  password: any;
  getUsers: boolean = false;
  mobileNo: any;
  userData: any;
  allUsers: any = [];
  UserId: any;
  regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;


  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute, public toastr: ToastrService) {
    this.userData = JSON.parse(localStorage.getItem("USER"));
    this.getAllUsers();
  }

  ngOnInit() {
    
  }

  async getAllUsers() {
    this.getUsers = false
    this.allUsers = [];
    let getUser = await ithours_client.get('User', {})
    debugger
    if (getUser.apidata.Data) {
      //this.allUsers = getUser.apidata.Data
      for (var checkUser = 0; checkUser < getUser.apidata.Data.length; checkUser++){
        if (getUser.apidata.Data[checkUser].role !== 'ADMIN'){
          this.allUsers.push(getUser.apidata.Data[checkUser])
        }
      }
    }
    this.getUsers = true
  }

  openModelforEdituser(userData) {
    this.emailerror = ''
    this.mobileerror = ''
    this.passworderror = ''
    this.mobileNo = userData.phone
    this.emailId = userData.email
    this.password = userData.password
    this.mobileColor = "#5c6873";
    this.emailColor =  "#5c6873";
    this.UserId = userData._id
    $('#editUser').modal('show')
  }

  validateData
  emailerror = '';
  mobileerror = '';
  passworderror = '';
  async updateUserDetails() {
    debugger
    let isError = false;
    if (this.emailId) {
      if (!this.regex.test(this.emailId)) {
        isError = true;
        this.emailerror = "Email is incorrect";
      }
    } else {
      isError = true;
      this.emailerror = "Email is required";
    }

    if (this.mobileNo) {
      if ((this.mobileNo).toString().length !== 10) {
        isError = true;
        this.mobileerror = "Mobile is incorrect";
      }
    } else {
      isError = true;
      this.mobileerror = "Mobile is required";
    }


    if (this.password) {
      
    } else {
      isError = true;
      this.passworderror = "Password is required";
    }

    if (isError) return;


    if (this.mobileNo && this.emailId && this.password) {
      let adduser = await ithours_client.update(
        "User",
        {
          _id: this.UserId
        },
        {
          $set: {
            phone: this.mobileNo,
            email: this.emailId,
            password: this.password,
            
          }
        }
      );
      if (adduser.apidata.Data) {
        this.getAllUsers();
        this.toastr.success("", 'User updated Successfully');
        $('#editUser').modal('hide');
      }
    }
    else {
      
      this.toastr.error("", 'Something went to wrong');
    }
  }

  openModalDeleteUser(userData) {
    this.UserId = userData._id
    $('#deleteUser').modal('show')
  }
  async deleteUser() {
    let confirm = await ithours_client.delete("User", {
        id: this.UserId
      });
      if (confirm.apidata.Data) {
        this.getAllUsers();
        this.toastr.success("", 'User deleted Successfully');
        $('#deleteUser').modal('hide')
    }
  }

  hideModal() {
    $('#editUser').modal('hide')
  }
  emailValiadtion(emailId) {
    this.emailerror = ''
    this.emailColor = "red";
   
    if (this.regex.test(this.emailId)) {
      this.emailColor = "#5c6873";
    } else {
      this.emailColor = "red";
    }
  }

  passwordCheck(password) {
    this.passworderror = ''
    if (password == ''){
      this.passworderror = "Password is required"
    }
  }
  mobileNumberCheck(mobile) {
    this.mobileerror = ''
    this.mobileNo = mobile
    if (mobile == '') {
      this.mobileerror = "Mobile is required"
    }
    if ((this.mobileNo).toString().length == 10) {
      this.mobileColor = "#5c6873";
    } else {
      this.mobileColor = "red";
    }
  }
  

}
