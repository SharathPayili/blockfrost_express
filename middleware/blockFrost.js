// importing blockfrost library
const Blockfrost = require("@blockfrost/blockfrost-js");
// using my api key
const API = new Blockfrost.BlockFrostAPI({
  projectId: "mainnetEGv6KABbcd4sv3r1vLpoD02y48UWjul2", // my Blockfrost project API key
});

function blockfrost () {}

blockfrost.getAssetList = async function () {
    try{
        // returns list of asset ids and their quantities
        const assetList = await API.assets({page: 1, count: 20, order: "desc"});
        // adding a property called type for each element in the list, determined by the quantity of the asset
        // If quantity is 1 then it is non-fungible token, if greater than 1 then fungible.
        assetList.forEach(val => {  
            val.type = parseInt(val.quantity) === 1 ? "NFT" : "Fungible";
          });
        return assetList;
    }
    catch(error) {
        console.log(error);
    }
}

blockfrost.getAssetMetadata = async function (val) {
    try {
        return await API.assetsById(val);
    } catch (error) {
        console.log(error);
    }
}

blockfrost.getTransactionHistory = async function () {
    try {
        return await API.assetsHistory('74dede5b6c7ab4d91d6238f82a612e6eb87a70e53c2e84015430bac1454162374a55');
    } catch (error) {
        console.log(error);
    }
}

blockfrost.getTransactionDetails = async function (val) {
    try {
        return await API.txs(val);
    } catch (error) {
        console.log(error);
    }
}

module.exports = blockfrost;