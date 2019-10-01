# fancy-todo

Fancy Todo Project

All the endpoints API can be access from:
```jacascript
http://localhost:3000
```

## Users
+ ### Register
  method: `POST`<br>
  endpoint: `/user/register`
  
  #### _Request_ :
  * body: 
    ```javascript
    username: String, required
    email: String, required
    password: String, required
    ```
    
  #### _Response_ :
  - 201
    ```javascript
    {
      token: V5MUfXvUrP9XItkuxzfziOqjRTqWYsqusNDUsORJ7Xqae9OrU33e2
    }
    ```
  - 403
    ```javascript
    {
      "code": 403
    }
    ```
+ ### Sign In
  method: `POST`<br>
  endpoint: `/users/signin`
  
  #### _Request_ :
  * body: 
    ```javascript
    email: String, required
    password: String, required
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
   - 404
    ```javascript
    Invalid username / password
    ```
+ ### Get Profile
  method: `GET`<br>
  endpoint: `/image/:token`
  
  #### _Request_ :
  * params: 
    ```javascript
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
        full_name: "john doe"
        username: "johndoe",
        profile_pic: "http://balcblablasd"
    ```
   - 404
    ```javascript
    Not Found
    ```

## Todo
+ ### Add Todo
  method: `POST`<br>
  endpoint: `/todo`
  
  #### _Request_ :
  * body: 
    ```javascript
    todo: "foo",
    desc: "bar, 
    due_date: "2019-10-10",
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
    
  #### _Response_ :
  - 201
    ```javascript
    {
      todo: "foo",
      desc: "bar, 
      due_date: "2019-10-10"
    }
    ```
  - 403
    ```javascript
    {
      "code": 403
    }
    ```
+ ### Detail
  method: `GET`<br>
  endpoint: `/todo/detail/:id`
  
  #### _Request_ :
  * params: 
    ```javascript
    id: String, required
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
        [
          {
            todo: "foo",
            desc: "bar, 
            due_date: "2019-10-10", 
            status: false
          }. 
          {
            todo: "foo",
            desc: "bar, 
            due_date: "2019-10-10", 
            status: true
          }
        ]
    ```
   - 404
    ```javascript
    Invalid username / password
    ```
+ ### Delete todo
  method: `DELETE`<br>
  endpoint: `/todo/:todo_id/:token`
  
  #### _Request_ :
  * params: 
    ```javascript
    todo_id: OiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNT,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
        {status: true}
    ```
   - 404
    ```javascript
    Not Found
    ```
+ ### Done todo
  method: `POST`<br>
  endpoint: `/todo/done/:todo_id/:token`
  
  #### _Request_ :
  * params: 
    ```javascript
    todo_id: OiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNT,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
        {status: true}
    ```
   - 404
    ```javascript
    Not Found
    ```
+ ### Update todo
  method: `POST`<br>
  endpoint: `/todo/update/:todo_id/:token`
  
  #### _Request_ :
  * params: 
    ```javascript
    todo_id: OiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNT,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiYWR1IiwiZW1haWwiOiJiYWR1QG1haWwuY29tIiwiaWF0IjoxNTY0OTkzNzgxfQ.Q4JKT7BRNCPOGUgTF-9NQTU2YASPRg7a3kO72fpPRY8
    ```
  * body: 
    ```javascript
      {
        todo: "foo",
        desc: "bar, 
        due_date: "2019-10-10", 
        status: false
      }
    ```
    
  #### _Response_ :
  - 200
    Will be response a token
    ```javascript
      {
        message: 'updated'
      }
    ```
   - 404
    ```javascript
    Not Found
    ```
