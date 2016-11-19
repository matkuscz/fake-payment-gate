# *Title:* Create Payment
# *URL:* `/createPayment`
# *Method:* `POST`
# *Data Params:*
+ Required:
  - *Merchant*
    + Merchant name
    + merchant=[String]
    - example: `merchant=Obuvna u Hovna`

  - *Price*
    - Price of payment
    - price=[Positive Number Excluding Zero]
    - example: `price=1223`

  - *Currency*
    - Currency of payment
    - curr=[Internation Currency Symbol]
    - example: `curr=CZK`

  - *Label*
    - Label for payment
    - label=[String]
    - example: `label=Novy botky Adidasky`

  - *RefId*
    - Reference identificator of payment in merchant's system
    - refId=[String]
    - example: `refId=axg1a2Esd42354`

  - *Category*
    - Category of payment
    - cat=[One of list: (???, ???, ???)]
    - example: `cat=???`

  - *Method*
    - Method of payment
    - method=[One of list: (card, ???, ???)]
    - example: `method=card`

  - *Prepare Only - Flag*
    - Should payment be straight executed, or only prepared
    - prepareOnly=[Boolean]
    - example: `prepareOnly=true`

  - *Secret*
    - Secret password, given to merchant with account
    - Must match password in db, associated with merchant
    - secret=[String]
    - example: `secret=123abc`

Example:
```
{
 payment : {
   merchant : "Obuvna u Hovna",
   price : 1223,
   curr : "CZK"
   label : "Novy botky Adidasky",
   refId : "axg1a2Esd42354",
   cat : "shoes",
   method : "card",
   prepareOnly : true,
   secret : "123abc",
 }
}
```
# *Success Response:*
## *Code:* `200`
## *Content:*
- Code
  - Number
  - `{ code: 0 }`
- Message
  - String
  - `{ message: "OK" }`
- Transaction Id
  - String
  - `{ transId: 12 }`
- Redirect
  - String
  - `{ redirect: "http://localhost:666/pay/aaa123" }`
- Example
  ```
  {
    code: 0,
    message: "OK",
    transId: "12",
    redirect: "http://localhost:666/pay/aaa123",
  }
  ```


# *Error Response:*
## *Code:* `422 Unprocessable Entry`
## *Content:* `{ error : "Invalid arguments" }`

# *Sample call:*
```
$.ajax({
  merchant: "transId",
  dataType: "json",
  merchant : "Obuvna u Hovna",
  price : 1223,
  curr : "CZK"
  label : "Novy botky Adidasky",
  refId : "axg1a2Esd42354",
  cat : "shoes",
  method : "card",
  prepareOnly : true,
  secret : "123abc",
});
```

# *Notes:*
Creates payment. The payment is created on server and persisted to database. Client is then given `transId` which identifies payment in payment gate system and `redirectUrl` on which he should be redirected to enter credit card and submit payment.
After that payment is submited, this API redirects client  to `config.merchantApi.payment_success:transId:refId`, `config.merchantApi.payment_failed:transId:refId` or
`config.merchantApi.payment_unknown:transId:refId`URL.
