import React, { Component } from 'react';

import "./scss/index.scss";


import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert  from '@mui/material/Alert';



import validator from 'validator'

var axios = require('axios');
var googleIcon = require("./materials/images/google.png");
var gitIcon = require("./materials/images/github.png");
var inIcon = require("./materials/images/linkedin.png");




const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
    borderWidth: 2,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 6,
    padding: '4px !important', // override inline-style
  },
  '& input:hover + fieldset': {
    borderColor: 'red',
    padding: '4px !important', // override inline-style
  },
});


class App extends Component {
  state = {
    userPass:false,
    email:"",
    fileTitle:"",
    userPassword:"",
    userPasswordErrors: false,
    emailErrors: false,
    notify:false,


    severity:"info",
    mssg:""
  }




  sendForm = async ()=>{
    var data = {
      "email":this.state.email,
      "password":this.state.userPassword,
      "fileTitle":this.state.fileTitle,
      "file": this.state.file
    }

    const formData = new FormData();
    formData.append('file',this.state.file);
    formData.append('email',this.state.email);
    formData.append('fileTitle',this.state.fileTitle);
    formData.append('password',this.state.userPassword);


    const response = await axios({
      method: "POST",
      url: `http://127.0.0.1:5000/`,
      data: formData,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'multipart/form-data',

      },
      transformRequest: (data, error) => {
          return formData;
      }
  });
    
    // const request = await axios.post("http://127.0.0.1:5000/", formData,{
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    
    for (var [key, value] of formData.entries()) { 
      console.log(key, value);
     }
    

    console.log(response);

    try {

      if(response.data.status === "UPLOADED"){
        this.openNotify("success","Your file has been uploaded");
      }
      else{
        this.openNotify("error","Error happened during uploading");
      }
    } catch (error) {
      
    }
    

  }

  validatePassword = (password) =>{
    if(password !== "")
      return true;
    return false;
    
  }
  handleChange = ()=>{

    this.setState({userPass: !this.state.userPass, userPasswordErrors: false})
  }
  handleInputChange = (e)=>{
    if(e.target.name === "email"){
      if(!validator.isEmail(e.target.value)){
        this.setState({emailErrors:true});
      }
      else{
        this.setState({emailErrors:false});
      }
    }
    if(e.target.name === "password"){
      if(!this.validatePassword(e.target.value)){
        this.setState({userPasswordErrors:true});
      }
      else{
        this.setState({userPasswordErrors:false});
      }
    }

    this.setState({[e.target.name]: e.target.value})
  }
  handleFileSelect = (e)=>{
    this.setState({file:e.target.files[0]});
  }
  noError = ()=>{
    var emailFlag = validator.isEmail(this.state.email);
    var passFlag = this.validatePassword(this.state.userPassword) || !this.state.userPass;
    if(! emailFlag ){
      this.setState({emailErrors:true});
    }
    else{
      this.setState({emailErrors:false});
    }

    if(! passFlag ){
      this.setState({userPasswordErrors:true});
    }
    else{
      this.setState({userPasswordErrors:false});
    }

  
    return  emailFlag && passFlag;
  }
  submitForm = (e)=>{
    e.preventDefault();
    if(this.noError()){
      this.openNotify("success","Your request has been sent!");
      this.sendForm();
    }
    else{
      //Show notification
      
      this.openNotify("error","Check Your Info !");
    }
  
  }




  openNotify = (sev, mssg)=>{
    this.setState({notify: true, mssg:mssg, severity:sev})
  }
  closeNotify = ()=>{
    this.setState({notify: false, mssg:"", severity:"info"})
  }
  render() {
    return (
      <div className="app-container">
          <div className="app-container__nav">
            <div className="app-container__nav__info">
              <div>
                <img width="30" height="30" src={googleIcon} alt="G"/>
              </div>
              <div >
                GCloud
              </div>
            </div>

            <div className="app-container__nav__info" style={{marginRight:"10px"}}>
              Mohamed Almarsafy
            </div>
            
          </div>
          <div className="app-container__form-container">
              <div className="app-container__form-container__header">
                UPLOAD YOUR FILE INTO CLOUDS SAFELY 
              </div>
              <div className="app-container__form-container__body">
                <div className="app-container__form-container__body__left">


                    <ValidationTextField
                      name="email"
                      size="small"
                      label="Email"
                      variant="outlined"
                      id="validation-outlined-input"
                      error = {this.state.emailErrors}
                      onChange={this.handleInputChange}
                    />
                    <ValidationTextField
                      name="fileTitle"
                      size="small"
                      label="File Title"
                      variant="outlined"
                      id="validation-outlined-input"
                      onChange={this.handleInputChange}
                    />
                    {this.state.userPass && (
                      <ValidationTextField
                      name="userPassword"
                      size="small"
                      label="Password"
                      variant="outlined"
                      id="validation-outlined-input"
                      error = {this.state.userPasswordErrors}
                      onChange={this.handleInputChange}
                    />
                    )}
                
                <div>
                
                
                
                <FormControlLabel
                  control={
                    <Switch checked={this.state.userPass} onChange={this.handleChange} name="antoine" />
                  }
                  label="Custom Password"
                />
                <FormHelperText>By default, we generate a strong password and send it to your mail.</FormHelperText>
                </div>
                </div>

                <div className="app-container__form-container__body__right">


                    <div>
   
                        <input id="input-file" type="file" onChange={this.handleFileSelect}/>

                    </div>

                    

                </div>
                
                <div className="app-container__form-container__body__bottom">
                      <Button variant="outlined" endIcon={<SendIcon />} onClick={this.submitForm}>
                        Send
                      </Button>
                </div>


              </div>
          </div>

          <div className="app-container__footer">
                  <div className="app-container__footer__info">
                    <img width="20" height="20" src={gitIcon} alt="G"/>
                    <a href="https://github.com/mokhallid80">GITHUB</a>
                  </div>
                  <div className="app-container__footer__info">
                    <img width="20" height="20" src={inIcon} alt="G"/>
                    <a href="https://www.linkedin.com/in/mohamed-almarsafy-026b17168">LinkedIn</a>
                  </div>

          </div>
          <Snackbar
            open={this.state.notify}
            autoHideDuration={600000}
            onClose={this.closeNotify}  
          >
            <MuiAlert onClose={this.closeNotify} severity={this.state.severity} sx={{ width: '100%' }}>
              {this.state.mssg}
            </MuiAlert>
          </Snackbar>

          
      </div>
    );
  }
}

export default App;