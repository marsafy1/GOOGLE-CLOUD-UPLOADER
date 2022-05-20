from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from zipfile import ZipFile
from cryptography.fernet import Fernet
import random
import string
import os
import pyminizip
from werkzeug.utils import secure_filename
import smtplib, ssl





# Setting the flask app.
app = Flask(__name__)
api = Api(app)
CORS(app)

# Setting the google drive.

gauth = GoogleAuth()      
drive = GoogleDrive(gauth)  

port = 465  # For SSL
sender_password = "YOUR_APPLICATION_PASSWORD"
sender_email = "YOUR_EMAIL"
context = ssl.create_default_context()


def generatePassword(password):
    if(len(password) == 0):
        S = 20  # number of characters in the string.   
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(S))
        print(str(result_str))
        return str(result_str)  
    return password

def compressAndEncrypt(f, fileTitle, password, email):
    filePath = secure_filename(f.filename)
    f.save(filePath)

    try:
        inpt = filePath
        # prefix path
        pre = None
        # output zip file path
        oupt = "./output.zip"
        # password for the compressed file
        newPassword = generatePassword(password)
        # compress level
        com_lvl = 5
        # compressing file
        pyminizip.compress(inpt, None, oupt,
                        newPassword, com_lvl)
        if(uploadToCloud(fileTitle) == True):
            sendMail(email, fileTitle, newPassword)
            os.remove(filePath)
            return True
        else:
            return False
    except :   
        return False
    


def sendMail(email, fileTitle, password):

    sent_from = sender_email
    to = [email]
    content = "The password for "+fileTitle+" is " + password
    message = 'Subject: {}\n\n{}'.format("Your GCLoud Password", content)

    smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    smtp_server.ehlo()
    smtp_server.login(sender_email, sender_password)
    smtp_server.sendmail(sent_from, to, message)
    smtp_server.close()
    print ("Email sent successfully!")





def uploadToCloud(fileTitle):
    print("EXECUTING THE UPLOADING")

    try:



        file = drive.CreateFile({'title': fileTitle})
        file.SetContentFile("output.zip")
        file.Upload()

        print("UPLOADED SUCCESSFULLY")

        os.remove("./output.zip")
        return True
    except:
        return False




@app.route("/", methods=["POST"])
def main():
    email = request.form["email"]
    fileTitle = request.form["fileTitle"]
    password = request.form["password"]
    print("the maill we got")
    print(email)
    if 'file' in request.files:
        file = request.files['file']
        
        if(compressAndEncrypt(file, fileTitle, password, email ) == True):
            print("Done")
            return {'status': "UPLOADED"}
        else:
            return {'status': "Failed Reading"}
        
    
        return {'status': "Failed Parsing"}        

    else:

        return {'status': "Failed"} 


    return {'status': "Failed"} 


if __name__ == '__main__':
    app.run(debug=True)  
