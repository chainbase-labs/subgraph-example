# Friend Tech Subgraph Development

---
Friend Tech Project Information
- Project Name: Friend Tech
- Project Description: Friend Tech is a decentralized social platform that allows users to tokenize themselves.
- Blockchain: Base
- Contract Address: 0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4
- Website: https://www.friend.tech

### Install Dependencies

```bash
yarn add @graphprotocol/graph-cli
yarn add @graphprotocol/graph-ts
```

### 二、 Subgraph Creation
### 2.1 Download Contract ABI File
First, we can manually download the contract's ABI file to our local machine to speed up the creation process. Contract ABI address: https://basescan.org/address/0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4#code
Write the ABI file content into the ft.json file
![img_3.png](friend-tech/imgs/img_3.png)
![img_2.png](friend-tech/imgs/img_2.png)
```bash
➜ cd tmp
➜ vim ft.json
➜ cat ft.json
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],
...
```

### 2.2 Initialize Subgraph Project
After installing the graph-cli tool, we create a new directory locally, then use the graph init command in the terminal to initialize a new subgraph project
![img_1.png](friend-tech/imgs/img_1.png)
The graph cli client will guide you step by step through the creation process. The parameters that need to be customized may vary depending on the client version, but generally are as follows:
```bash
➜  tmp graph init
✔ Protocol · ethereum
✔ Product for which to initialize · subgraph-studio
✔ Subgraph slug · friend-tech
✔ Directory to create the subgraph in · friend-tech
✔ Ethereum network · mainnet # EVM-compatible chains can all choose mainnet
✔ Contract address · 0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4 # Contract address
✖ Failed to fetch ABI from Etherscan: request to https://api.etherscan.io/api?module=contract&action=getabi&address=0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4 failed, reason: read ECONNRESET
✖ Failed to fetch Start Block: Failed to fetch contract creation transaction hash

✔ ABI file (path) · ./ft.json  # Fill in the ABI file we manually downloaded here
✔ Start Block · 2430440 # Block height where the contract was created
✔ Contract Name · Contract
✔ Index contract events as entities (Y/n) · true
  Generate subgraph
  Write subgraph to directory
✔ Create subgraph scaffold
✔ Initialize networks config
✔ Initialize subgraph repository
✖ Failed to install dependencies: Command failed: yarn # Don't worry about the error, we'll show you how to solve it below
```
Get the contract deployment block height
![img_4.png](friend-tech/imgs/img_4.png)
![img_5.png](friend-tech/imgs/img_5.png)
Finally, yarn or npm will install some specific project dependencies according to the initialization process. There might be an error about a non-existent feat/smaller branch in the concat-stream GitHub repository. We can use the resolutions in package.json to redirect the problematic branch to our chainbase branch:
```json
  "resolutions": {
    "concat-stream": "https://github.com/chainbase-labs/concat-stream#1.4.x"
  },
```
![img_6.png](friend-tech/imgs/img_6.png)

Finally, run yarn install again to confirm that the project initialization dependencies are normal
```bash
yarn && yarn install
```

### 2.3 Write Subgraph Schema
![img_7.png](friend-tech/imgs/img_7.png)
After graph init is completed, it will automatically generate the above framework code for us. We only need to modify a few files to achieve our goal of indexing the BAYC contract. Let's understand the role of each file step by step and try to write a subgraph that can index contract data
1. subgraph.yaml
   The first step is to define our data source, which tells the subgraph exactly what smart contract to index, the contract address, network, ABI, and some handlers triggered by indexing
```bash
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: Contract
    network: mainnet
    source:
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4"
      abi: Contract
      startBlock: 2430440
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - OwnershipTransferred
        - Trade
      abis:
        - name: Contract
          file: ./abis/Contract.json
      eventHandlers:
        - event: Trade(address,address,bool,uint256,uint256,uint256,uint256,uint256)
          handler: handleTrade
      file: ./src/contract.ts
```
The Graph allows us to define three types of handler functions on EVM chains: event handlers, call handlers, and block handlers. For details, refer to:：**[Subgraph Manifest](https://github.com/graphprotocol/graph-node/blob/master/docs/subgraph-manifest.md)**

The core handler function here is eventHandlers, which defines how we index data from blockchain events. Taking the Transfer event as an example:

- This event is triggered whenever an NFT is transferred from one address to another. It records the previous owner of the NFT, the new owner, and the specific NFT TOKEN ID
- We want to record transfers from the initial block, so we can record the complete ownership history of BAYC NFTs
- Additionally, if we mark the Transfer ID entity as immutable when defining it later, the query speed will be faster

2. schema.garphql
   The schema defines the data types we need to store, which are ultimately stored in postgresql fields. These fields can also be used to customize query statements later
```bash
type Protocol @entity {
  id: ID!
  userCount: Int!
  protocolRevenue: BigDecimal!
  accountRevenue: BigDecimal!
  tradeVolume: BigDecimal!
  totalTrades: Int!
}

type Account @entity {
  id: ID!
  holdersCount: Int!
  keySupply: BigDecimal!
  holders: [Holder!]! @derivedFrom(field: "account")
}

type Holder @entity {
  id: ID!
  account: Account!
  keysOwned: BigDecimal!
}

type Trade @entity {
  id: ID!
  trader: Bytes!
  subject: Bytes!
  isBuy: Boolean!
  shareAmount: BigDecimal!
  ethAmount: BigDecimal!
  protocolEthAmount: BigDecimal!
  subjectEthAmount: BigDecimal!
  supply: BigDecimal!
}
```
There are a few points to note here. Each entity needs to have an @entity directive. It also needs to have an ID field, whose unique value must apply to all entities of the same type. Below are some common data types, for details refer to: Types
![img_8.png](friend-tech/imgs/img_8.png)

3. contract.ts(friendtech-shares-v-1.ts)
   This file is our handler, which is the specific logic for indexing data from blockchain events. Here we only need to focus on the handleTrade function, which will be called every time a Transfer event is triggered. We can define the data we need to index here
```bash
import { BigDecimal, crypto, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
    Trade as TradeEvent,
} from '../../../friend-tech/generated/FriendtechSharesV1/FriendtechSharesV1'
import { Trade, Protocol, Account, Holder } from '../../../friend-tech/generated/schema'

function getOrCreateAccount(accountId: string): Account {
    let account = Account.load(accountId)
    if (account == null) {
        account = new Account(accountId)
        account.holdersCount = 0
        account.keySupply = BigDecimal.fromString('0')
        account.save()
    }
    return account as Account
}

function getOrCreateHolder(holderId: string, account: Account): Holder {
    let holder = Holder.load(holderId)
    if (holder == null) {
        holder = new Holder(holderId)
        holder.keysOwned = BigDecimal.fromString('0')
        holder.account = account.id
        holder.save()

        // Update account's holders count
        account.holdersCount = account.holdersCount + 1
        account.save()
    }
    return holder as Holder
}

function getOrCreateProtocol(protocolId: string): Protocol {
    let protocol = Protocol.load(protocolId)
    if (protocol == null) {
        protocol = new Protocol(protocolId)
        protocol.userCount = 0
        protocol.protocolRevenue = BigDecimal.fromString('0')
        protocol.accountRevenue = BigDecimal.fromString('0')
        protocol.tradeVolume = BigDecimal.fromString('0')
        protocol.totalTrades = 0
        protocol.save()
    }
    return protocol as Protocol
}

export function handleTrade(event: TradeEvent): void {
    let trade = new Trade(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    trade.trader = event.params.trader
    trade.subject = event.params.subject
    trade.isBuy = event.params.isBuy
    trade.shareAmount = event.params.shareAmount.toBigDecimal()
    trade.ethAmount = event.params.ethAmount.toBigDecimal()
    trade.protocolEthAmount = event.params.protocolEthAmount.toBigDecimal()
    trade.subjectEthAmount = event.params.subjectEthAmount.toBigDecimal()
    trade.supply = event.params.supply.toBigDecimal()
    trade.save()

    let protocol = getOrCreateProtocol('1') // Assuming there is only one protocol
    protocol.tradeVolume = protocol.tradeVolume.plus(trade.ethAmount)
    protocol.totalTrades = protocol.totalTrades + 1
    protocol.protocolRevenue = protocol.protocolRevenue.plus(trade.protocolEthAmount)
    protocol.accountRevenue = protocol.accountRevenue.plus(trade.subjectEthAmount)
    protocol.userCount = protocol.userCount + 1 // This logic may need adjustment based on your specific definition of a user
    protocol.save()

    let accountId = event.params.trader.toHex()
    let account = getOrCreateAccount(accountId)

    account.keySupply = account.keySupply.plus(trade.shareAmount) // Assuming shareAmount corresponds to keys
    account.save()

    let holderId = event.transaction.from.toHex()
    let holder = getOrCreateHolder(holderId, account)

    holder.keysOwned = holder.keysOwned.plus(trade.shareAmount) // Update the keys owned by this holder
    holder.save()
}
```

### 2.3 Compile and Build
At this point, we have completed the development of a simple subgraph. Next, we can compile our code and deploy the subgraph.

1. graph codegen

After modifying the subgraph.yaml and schema.graphql files, we need to execute codegen every time to generate the corresponding AssemblyScript files in the generated directory:
```bash
➜  friend-tech git:(main) ✗ graph codegen               
  Skip migration: Bump mapping apiVersion from 0.0.1 to 0.0.2
  Skip migration: Bump mapping apiVersion from 0.0.2 to 0.0.3
  Skip migration: Bump mapping apiVersion from 0.0.3 to 0.0.4
  Skip migration: Bump mapping apiVersion from 0.0.4 to 0.0.5
  Skip migration: Bump mapping apiVersion from 0.0.5 to 0.0.6
  Skip migration: Bump manifest specVersion from 0.0.1 to 0.0.2
  Skip migration: Bump manifest specVersion from 0.0.2 to 0.0.4
✔ Apply migrations
✔ Load subgraph from subgraph.yaml
  Load contract ABI from abis/Contract.json
✔ Load contract ABIs
  Generate types for contract ABI: Contract (abis/Contract.json)
  Write types to generated/Contract/Contract.ts
✔ Generate types for contract ABIs
✔ Generate types for data source templates
✔ Load data source template ABIs
✔ Generate types for data source template ABIs
✔ Load GraphQL schema from schema.graphql
  Write types to generated/schema.ts
✔ Generate types for GraphQL schema

Types generated successfully
```

2. graph build
   Turn the subgraph into WebAssembly, waiting for deployment
```bash
➜  friend-tech git:(main) ✗ graph build  
  Skip migration: Bump mapping apiVersion from 0.0.1 to 0.0.2
  Skip migration: Bump mapping apiVersion from 0.0.2 to 0.0.3
  Skip migration: Bump mapping apiVersion from 0.0.3 to 0.0.4
  Skip migration: Bump mapping apiVersion from 0.0.4 to 0.0.5
  Skip migration: Bump mapping apiVersion from 0.0.5 to 0.0.6
  Skip migration: Bump manifest specVersion from 0.0.1 to 0.0.2
  Skip migration: Bump manifest specVersion from 0.0.2 to 0.0.4
✔ Apply migrations
✔ Load subgraph from subgraph.yaml
  Compile data source: Contract => build/Contract/Contract.wasm
✔ Compile subgraph
  Copy schema file build/schema.graphql
  Write subgraph file build/Contract/abis/Contract.json
  Write subgraph manifest build/subgraph.yaml
✔ Write compiled subgraph to build/

Build completed: build/subgraph.yaml
```

3. Deploy our subgraph
   Start our local docker instance (note to modify the RPC address in node.toml, an API key is required, if you don't have one, you can create it in the chainbase backend)

```bash
➜  cd docker
➜  vim node.toml(*modify RPC address*)
➜  cd docker-compose up
```
After successful deployment, we wait for a few minutes, and our indexed data should be in the local database
![img.png](friend-tech/imgs/img_11.png)

Use another terminal to deploy our subgraph
```bash
cd ../friend-tech 
yarn create-local
yarn deploy-local 
```

After successful deployment, you can see the deployment_id of our newly deployed subgraph in the docker running log
![img.png](friend-tech/imgs/img_9.png)
Open the GraphQL query window locally
http://127.0.0.1:8000/subgraphs/id/QmQVk7YWVwHRhxHvZyqyLxT8Ue4hc2TWtk439xocMeNjZF
![img.png](friend-tech/imgs/img_10.png)