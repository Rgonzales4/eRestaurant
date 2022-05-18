## About eRestaurant

Software Engineering Studio 1A

Case Study: eRestaurant

Group 8 - 3 Michelin Star Programmers

Team Members:
- Katrina George (13940174)
- Roshel Gonzales (13883931)
- Kieren Karanjia (13912795)
- Joseph Kokkat (13919725)
- Sarah Sindone (13902337)

---

## Setting up the application

>**IMPORTANT:** MongoDB compass is required for this application to store all data made

1. Create the .env file, the following fields is needed for the .env file:
```
DB_Connection= {insert address to local mongodb compass}
SESSION_SECRET=secret
EMAIL_ADDRESS= {insert the email for the restaurant}
EMAIL_ADDRESS_PASSWORD= {insert the password for the email}
```

2. The registration process requires a restaurant email to send a verification link when new users register:
    - Create an email to act as the restaurant's email
    - Make sure to add the email address and the password to the email in the .env file

3. Download the [MongoDB community server](https://www.mongodb.com/try/download/community) 
    - Make sure to insert the local address to of your database into the .env file

4. Before starting the application, make sure all the packages have been installed.
    - Go through the ```package.json``` file to view the packages neede for the website to function

5. When running the website, make sure MongoDB is running


That should be all the set-up steps required to run the web application, if there are any problems when setting up please contact: ```lebistrotdandre08@gmail.com```

