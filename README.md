# orbitez

P2E canvas game with NFT pass/skin and DeFi mechanics 
1. **Main page**:
  - Staging - https://staging.orbitez.io
  - Production - https://orbitez.io

2. **Dashboard**:
  - Staging - https://staging.orbitez.io/dashboard
  - Production - https://orbitez.io/dashboard

## Tech stack

- Back-end: Next.js
- Front-end: React + Canvas
- Smart-contracts: Archetype
- Testing: jest, completium-cli
- Deploy: Docker, letsencrypt

Smart-contract address (old one):
~~https://better-call.dev/ghostnet/KT1QQnpFLKtUwLDTPofnudfPdmCuBmtmQkrz/operations~~

Smart-contract address (actual, connected to orbitez.io):
https://better-call.dev/ghostnet/KT1WRAucboJ8yD7fFtEpS7vJ1bVs9qaLvm8Q/operations

## Game Universe

The player will have to take part in the process of forming solar systems. They will fight for survival by controlling a small little planet, which is gradually gaining mass by collecting particles of matter and other small celestial bodies.
The speed in the game is measured not in minutes, but in hundreds of thousands of years. Thus, one match lasts about 100 thousand years.
Time in the game universe runs its course. Inevitably there appears technologically advanced civilizations. Over time, the game will change Epoches. The initial set of planets represents the First Epoch of "natural planets". The Second Epoch of "wandering planets" will contain worlds modified by a technically advanced civilization. On them, you will find Space elevators, planetary engines, Bussard ramjets, etc. The Third Epoch of "artificial planets" will consist of fully artificial cosmic bodies, such as Dyson spheres and Ringworlds.

## Transactions flow | Mechanics

- Mint or buy a unique orbitoid for 1tez to get into the game (you can play without owning a planet, your game skin will be the default planet).
- Enter battleground lobby with orbitoid NFT and choose bet type: 1tez (production room size = 3 players, staging room size = 10 players with 7 bots. First 4 bots join after 30 second each, then 1 bot after 1 minute + 1 bot after 1.5 minutes + last bot after 2 minutes).
- 77% of the battleground bank goes to the TOP 3 players at the time of baking the final block (1 round = 15 blocks in Tezos chain, but it's customizable).
- 3% goes to first player who called "Claim all".
- 10% goes to admin address.
- 10% goes to the owner of the server on which the game took place (use our [1-click game server deployment feature](#game-server-deployments) to have your own server!).

![bounty_explain](https://user-images.githubusercontent.com/4786779/221579327-1c8abb2b-b75f-4c79-8f22-e8448f478d8f.png)

## Game Server Deployments
Orbitez allows you to deploy your own game server and optionally a Tezos Node in one click on a cloud Provider of your choice (Currently fully supported are: DigitalOcean. In progress: AWS, GCP, Azure).

Once the server is created you can configure the server parameters and register it in the smart contract of the game - this will allow you to receive 50% of all the fees we collect on every game played.

We leverage Docker hub to securely store images of the orbitez.io game server. 

## Tezos node deployment
Mainnet nodes are often overloaded and/or have high latencies and with many popular projects it gets nearly impossible to mint anything unless you're leveraging your own node.
Our goal is to make deployment of your own Tezos node as simple as possible for the user. Tick a checkbox when deploying a game server with us and we'll bring up your very own Tezos node you can plug & play directly into your Temple wallet. All HTTPS certs are taken care of by us: your own node will have a dedicated HTTPS endpoint based on the orbitez.io subdomain.

## Flex points / FAQs
1. How do we prevent forgery of the leaderboard?

We run a custom Oracle on the back-end server which communicates with the game server and signs the leaderboard object. Front-end only receives signed and packed encoded values of the game state when the game ends - this ensures consistency of data end to end.

2. How do we handle flakiness and slowness of IPFS gateways in global setup?

IPFS gateways have proven to be quite inconsistent and unreliable. Depending on where you are and how loaded gateways are some may perform significantly better than others.
We selected the top 10 IPFS gateway providers and perform a race-test. Whichever gateway provider wins the `Promise.race` gets to serve us our beautiful generative planets inside of the game.


## Planned

- [x] Animated Orbitoid(planet) in action!
- [ ] Play with your own FA2 NFT as a skin in orbitez game (hold 100 ORB token to unlock this feature)
- [ ] ORB token farming (incentivize farmers to bet in LP as good as players to farm with ORB rewards)
- [ ] Liquidity Baking LP(SIRS) bets
- [ ] Proof of leaderboard (Merkle tree -> own tzstamp server). 
- [ ] Each block send tx with merkle tree of all player key events in the game
- [ ] Federative servers(matrix protocol or simmilar) with state replication 

## Gameplay

Fight with players from all over the world as you try to become the largest Planet in a solar system! Control your tiny planet and eat other players to grow larger. Mint your own, unique generative planet as NFT to enter the battlefield!


## 💻 Quick start

### 1) Clone the repository

```
git clone https://github.com/stepandra/orb && cd orb
```

### 2) Requirements:

- [node](https://nodejs.org) installed, version 14 or later.

### 3) Build:

```
cd ./orbitez && npm i &&
npm run build
```

### 4) Start the app:

```
npm start -- -p 3000
```

The app will be available at http://localhost:3000

Note: some functions will not be available in your local app instance since they require secret env variables:
- bot addition feature;
- 1-click game server deployment feature;
- leaderbord signing at the end of the game.

### 4) (Optional) Run for development

- Start the dev server (Next.js):
  ```
  cd ./orbitez && npm i &&
  npm run dev
  ```

  The app will be available at http://localhost:3000
  
- To start a local instance of a game server:
  1. Enter the following commands:
     ```
     cd ./server && yarn &&
     STAGE="local" node src/index.js
     ```
  2. Create an `.env` file in the `orbitez` directory with the following contents:
     ```
     NEXT_PUBLIC_STAGE=local
     ```
     
  By clicking the "PLAY" button on the `/dashboard` page, you will be able to join your own local dev game server.
  

- Or you can boot up a local instance of the latest release of the orbitez server and connect it to the room in contract you own:
  ```
  docker run --env CONTRACT_ADDRESS=KT1QQnpFLKtUwLDTPofnudfPdmCuBmtmQkrz --env SERVER_NAME=${roomName} -d -p 8080:8080 -p 88:88 orbitez/orb-game-server-main:latest
  ```

### 5) Contract tests
#### Requirements:
Install tezos-client(MacOS):
```
brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
brew install tezos-client
```

Install tezos-client(Ubuntu):
```
sudo add-apt-repository ppa:serokell/tezos && sudo apt-get update
sudo apt install tezos-client -y
```

Install completium-cli and init it in root directory:
```
npm i @completium/completium-cli -g
completium-cli init
``` 

Install node packages in root directory:
```
npm i
```
Create .env file with `ORACLE_PRIVATE_KEY` and `ORACLE_PUBLIC_KEY` variables:
```
touch .env && echo "ORACLE_PRIVATE_KEY=''" >> .env && echo "ORACLE_PUBLIC_KEY=''" >> .env
```
Run test
```
npm run test-contracts
```
<img width="649" alt="Снимок экрана 2023-01-03 в 23 32 55" src="https://user-images.githubusercontent.com/4786779/210452341-35f8e86b-19f6-4cea-8680-d6a400390998.png">


## Contract entrypoints
- `clear_all` -  clear all assets except `leaderboard` [admin]
- `destroy_server` - remove selected server from storage [admin]
- `remove_room` - remove selected room on server [server_manager]
  - Parameters
    - room_idn string
    - server_idn string
- `create_server`
  - Parameters
    - serverd string
    - manag address
    - room_idx string
    - serverurl string
    - bet_size mutez
    - size_v nat
    - game_duration_v nat
- `end_game`
  - Parameters
    - parameter pair
    - room_idb string
    - serverid string
    - packed_outcome bytes
    - signed_outcome signature
- `enter_room`
  - Parameters
    - room_idv string
    - serverid string
- `refund`
  - Parameters
    - room_idq string
    - server_id string
