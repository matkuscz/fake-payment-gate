# *Title:* Pay
# *URL:* `/pay`
# *Method:* `POST`
# *Data Params:*
+ Required:
  - *Name*
    + Merchant name
    + name=[String]
    - example: `name=Obuvna u Hovna`

  - *Success Redirect*
    - Success redirect URL
    - Client is redirected to this URL after successful payment
    - successRedirect=[String]
    - example: `successRedirect=http://localhost:1337/platba/success/`

    - *Success Redirect*
      - Success redirect URL
      - Client is redirected to this URL after successful payment
      - successRedirect=[String]
      - example: `successRedirect=http://localhost:1337/platba/success/`

    - *Success Redirect*
      - Success redirect URL
      - Client is redirected to this URL after successful payment
      - successRedirect=[String]
      - example: `successRedirect=http://localhost:1337/platba/success/`      
  - *Secret*
    - Secret password, given to merchant with account
    - Must match password in db, associated with merchant
    - secret=[String]
    - example: `secret=123abc`

Example:
```
   {
     pay : {
       name : "Obuvna u Hovna",
       successRedirect : "http://localhost:1337/platba/success/",
       failedRedirect : "http://localhost:1337/platba/failed/",
       unknownRedirect : "http://localhost:1337/platba/unknown/",
     }
   }
```
# *Success Response:*
## *Code:* `200`
## *Content:*
- Secret
 - String
 - `{ secret: "abc123" }`

# *Error Response:*
## *Code:* `422 Unprocessable Entry`
## *Content:* `{ error : "Invalid arguments" }`

# *Sample call:*
```
$.ajax({
  name : "Obuvna u Hovna",
  successRedirect : "http://localhost:1337/platba/success/",
  failedRedirect : "http://localhost:1337/platba/failed/",
  unknownRedirect : "http://localhost:1337/platba/unknown/",
});
```

# *Notes:*
Create merchant. Merchant is given 'randomly' generated `secret key`. Merchant needs to set 3 URLs: `successRedirect`, `failedRedirect` and `unknownRedirect`
