A simple service to store and return build statuses
Using nodejs + expressjs + mysql

Dummy API call, used to test the environment
curl -v http://seenapps.com:3000/ping

Create new status:
curl -v -X POST http://seenapps.com:3000/
will return a JSON object such as {"id":"xyz"}

Read existing status "xyz":
curl -v GET http://seenapps.com:3000/xyz

Amend an existing status "xyz" to "BLAH"
curl -v -X PUT http://seenapps.com:3000/xyz/BLAH
