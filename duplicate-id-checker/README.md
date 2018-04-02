
# Duplicate ID checker

## GET Request

### Sample Query Parameters

Return full table output (for testing only)

> TableName=Idempotent

Return message id if exist for given integration reference and message id. 

> TableName=Idempotent&IntRef=wma3&MsgId=1242343


## POST Request

### Insert message id

Message body
> {    "TableName": "Idempotent",
    "Item": {
      "integrationReference": "sed10",
      "messageId": "11111",
      "ttl": 1522641647
    }
}

## DELETE Request

### Delete message id

Message Body

> {    "TableName": "Idempotent",
>     "Key": {
>       "integrationReference": "sdf",
>       "messageId": "df"
>     } }


