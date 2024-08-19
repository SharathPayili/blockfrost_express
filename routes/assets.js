const express = require('express');
const router = express.Router();
const blockfrostMethods = require('../middleware/blockFrost');
const Blockfrost = require("@blockfrost/blockfrost-js");
const API = new Blockfrost.BlockFrostAPI({
    projectId: "mainnetEGv6KABbcd4sv3r1vLpoD02y48UWjul2", // my Blockfrost project API key
});

// Route defining

/**
 * @swagger
 * /cardano/NFT/connectionTesting:
 *   get:
 *     summary: testing the connection by fecthing a block data
 *     description: response object is blockfrost latest block details
 *     responses:
 *       200:
 *         description: Succesful response about the block.
 */
router.get('/connectionTesting', async(req, res) => {
    try {
        // Fetch the latest block information
        const latestBlock = await API.blocksLatest();
        
        // Log the result to the console
        console.log("Connection Successful!");
        res.json(latestBlock);
      } catch (error) {
        console.error("Connection Failed!", error);
      }
});


/**
 * @swagger
 * /cardano/NFT/latestAssets:
 *   get:
 *     summary: Gets the latest Assests
 *     responses:
 *       200:
 *         description: Succesful response is Asset_ids, quantites and asset_type.
 */
router.get('/latestAssets', async(req, res) => {
    try {
        console.log("Fetching the asset list...");
    
        // Fetch the asset list and check if it's empty or undefined
        let assetList = await blockfrostMethods.getAssetList();
        
    
        // Process each asset to fetch metadata
        assetList = await Promise.all(assetList.map(async (val, index) => {
            try {
                console.log(`Processing asset ${index + 1}/${assetList.length}: ${val.asset}`);
    
                // Introducing a simulated delay for more realistic processing scenarios
                await new Promise(resolve => setTimeout(resolve, 50 * index));
    
                // Fetch the metadata for each asset and validate it
                val.metadata = await blockfrostMethods.getAssetMetadata(val.asset);
                if (!val.metadata) {
                    console.warn(`No metadata found for asset: ${val.asset}`);
                    val.metadata = { error: "No metadata available" }; // Assign default metadata on failure
                } else {
                    console.log(`Metadata fetched successfully for asset: ${val.asset}`);
                }
    
                return val; // Return the updated object with metadata and processed data
            } catch (metadataError) {
                console.error(`Failed to fetch metadata for asset: ${val.asset}`, metadataError);
                return { ...val, metadata: { error: "Failed to fetch metadata" }, details: metadataError.message };
            }
        }));
    
        
        console.log("Asset processing complete. Returning the result...");
        res.json(assetList);
    } catch (error) {
        console.error("Failed to complete asset list processing due to an error!", error);
        res.status(500).json({
            error: 'An error occurred while processing the asset list.',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /cardano/NFT/topHolders:
 *   get:
 *     summary: Gets the top holders of an asset
 *     responses:
 *       200:
 *         description: Succesful response is Stake_ids and their contorlled quantity.
 */
router.get('/topHolders', async(req, res) => {
    try {
        // First get transactions for a particular asset_id
        const assetTransactions = await API.assetsTransactions('74dede5b6c7ab4d91d6238f82a612e6eb87a70e53c2e84015430bac1454162374a55', {page: 1, count: 100, order: "desc"});
        const utxosList = await Promise.all(assetTransactions.map(async val => { 
            return await API.txsUtxos(val.tx_hash); // Return the updated object
        }));
        const stakeAddrList = await Promise.all(utxosList[0].outputs.map(async val => {
            return await API.addresses(val.address); // Return the stakeAddress details for each wallet address
        }));
        // Return the final stake address list sorted according to their controlled amounts
        res.json(stakeAddrList);
    } catch (error) {
        console.error("Connection Failed!", error);
    }
})

/**
 * @swagger
 * /cardano/NFT/assetTransactionHistory:
 *   get:
 *     summary: Gets details regarding transactions that happended with this asset
 *     responses:
 *       200:
 *         description: Succesful response is Stake_ids and their contorlled quantity.
 */
router.get('/assetTransactionHistory', async(req, res) => {
    try {
        let transactionHistory = await blockfrostMethods.getTransactionHistory();
        transactionHistory = await Promise.all(transactionHistory.map(async val => { 
            val.txMetadata = await blockfrostMethods.getTransactionDetails(val.tx_hash); // Method to get details for specific tx hash
            return val;
        }));
        res.json(transactionHistory);
    } catch (error) {
        console.error("Connection Failed!", error);
    }
})

module.exports = router;