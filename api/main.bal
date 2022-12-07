import ballerina/http;

listener http:Listener httpListener = new (8080);

type User record {
    int id;
    string email;
    string password?;
};

User[] users = [
    {
        id: 1,
        email: "rick.astley@yahoo.com",
        password: "never_give_up!"
    }
];

int nextUserId = users.length() + 1;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}

service / on httpListener {


    resource function get users() returns User[] {
        var usersWithoutPassword = from var {id, email} in users select {id, email};
        return usersWithoutPassword;
    }

    resource function get users/[int id]() returns anydata {
        anydata chosenUser = ();
        foreach User u in users {
            if (u.id == id) {
                chosenUser = u;
            }
        }
        return chosenUser;
    }

    resource function post users(@http:Payload json payload) returns User|error {

        foreach User u in users {
            if (u.email == payload.email) {
                return error("Użytkownik o tym adresie email jest już zarejestrowany.");
            }
        }

        User newUser = {
            id: nextUserId,
            email: check payload.email,
            password: check payload.password
        };

        nextUserId = nextUserId + 1;
        users.push(newUser);
        return newUser;
    }

    resource function post users/resetPassword(@http:Payload json payload) returns http:Accepted|http:BadRequest {

        foreach User u in users {
            if (u.email == payload.email) {
                http:Accepted accepted = {body: "Accepted (202)"};
                return accepted;
            }
        }
        http:BadRequest badRequest = {body: "Bad Request (400)"};
        return badRequest;
    }

    resource function post auth/login(@http:Payload json payload) returns http:Ok|http:Unauthorized|error {

        foreach User u in users {
            if u.email == payload.email && u.password == payload.password {
                http:Ok ok = {body: u};
                return ok;
            }
        }
        http:Unauthorized unauthorized = {body: "Unauthorized (401)"};
        return unauthorized;
    }

}
