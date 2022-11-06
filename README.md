# angular-14-ballerina-swanlake-login-page-component
<h2>Geotik recruitment task</h2>

This project was created as a recruitment task for Geotik company.

<h2>Main goal</h2>

Main goal was to create a register & login page component for Angular frontend app, enriched with Angular Material library and connect it with Ballerina language (https://ballerina.io/) based API.

<h2>API</h2>

API has been built using Ballerina language (SwanLake version) and it delivers following methods: 
<dl>
<dt>GET /users
<dd>Returns list of all users (ID + login/e-mail)</dd>

<dt>GET /users/<ID> </dt>
<dd>Returns data of user with specified ID (including password) <br/>
 // TODO: consider security of this approach</dd>

<dt>POST /users</dt>
<dd>In request body there has to be a new object of type User which wil be added to the users list.<br/>
User is a class containing 3 fields: id, email and password</dd>

<dt>POST /users/resetPassword</dt>
<dd>In request body there has to be an email of users, which passwords is intendet to be reset. Returns Accepted (202) response if an email is on the list or Bad Request (400) if it's not.

<dt>POST /auth/login</dt>
<dd>In request body there has to be an email and password. If they match an user form the list, method returns OK (200) response. If there's no such user found, it returns Unauthorized (401).
</dl>
