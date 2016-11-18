# *Title:* Create Merchant
# *URL:* `/createMerchant`
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

  - *Failed Redirect*
    - Failed redirect URL
    - Client is redirected to this URL after failed payment
    - failedRedirect=[String]
    - example: `failedRedirect=http://localhost:1337/platba/failed/`

  - *Unknown Redirect*
    - Unknown redirect URL
    - Client is redirected to this URL when payment is in unknown state
    - unknownRedirect=[String]
    - example: `successRedirect=http://localhost:1337/platba/unknown/`      

Example:
```
   {
     merchant : {
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
Creates merchant. Merchant is given 'randomly' generated `secret key`. This key should be sent with future requests together with `merchant name` to authorize merchant to our system. Merchant needs to set 3 URLs: `successRedirect`, `failedRedirect` and `unknownRedirect` on which his client would be redirected according to payment state.
