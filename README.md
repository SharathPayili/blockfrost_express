## Blockfrost Implementation in Express ##
Main Purpose is to fetch NFT related data, available queries are: fetching Latest assets, fetch holders/accounts of an asset, and asset transaction history.

## Prerequisites ##
Please install Node latest version

## Dependencies ##
```sh
# Install express, blockfrostapi, swagger ui
npm install express
npm install @blockfrost/blockfrost-js
npm install swagger-ui-express
npm install swagger-jsdoc
```

## Run ##
In the terminal, type: 
```sh
node app.js
```
After confirming that the server is running, open http://localhost:3000/api-docs and test the endpoints to get the data
