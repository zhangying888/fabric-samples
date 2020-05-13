#!/bin/bash
set -x

export PATH=../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export CHANNEL_NAME=mychannel

#      - GOPATH=/opt/gopath
export CORE_VM_ENDPOINT=unix:///var/run/docker.sock
      #- FABRIC_LOGGING_SPEC=DEBUG
export FABRIC_LOGGING_SPEC=INFO
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_CERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

# docker exec -it cli /bin/ash
# Environment variables for PEER0
# org1.example.com/users/Admin@org1.example.com/msp--->Admin@org1
CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

# 
export CHANNEL_NAME=mychannel
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
sleep 5


peer channel join -b mychannel.block

CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
CORE_PEER_ADDRESS=peer0.org2.example.com:9051 
CORE_PEER_LOCALMSPID="Org2MSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer channel join -b mychannel.block

CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
CORE_PEER_ADDRESS=peer0.org2.example.com:9051 
CORE_PEER_LOCALMSPID="Org2MSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 

peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


# install package on peer0 of org1
# this command installs a chaincode package on your peer
CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode package cp.tar.gz --lang node --path /home/zy/go/src/github.com/hyperledger/fabric-samples/commercial-paper-js/organization/magnetocorp/contract --label cp_0
peer lifecycle chaincode install cp.tar.gz
sleep 5
peer lifecycle chaincode queryinstalled >&log.txt
export CC_PACKAGE_ID=`sed -n '/Package/{s/^Package ID: //; s/, Label:.*$//; p;}' log.txt`
# # # this returns the details of the chaincode packages installed on your peers
peer lifecycle chaincode queryinstalled

peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME --name papercontract --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls true --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# # install package on peer0 of Org2
CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
CORE_PEER_ADDRESS=peer0.org2.example.com:9051 
CORE_PEER_LOCALMSPID="Org2MSP" 
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
peer lifecycle chaincode install cp.tar.gz
peer lifecycle chaincode queryinstalled >&log2.txt
export CC_PACKAGE_ID_2=`sed -n '/Package/{s/^Package ID: //; s/, Label:.*$//; p;}' log2.txt`
peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME --name papercontract --version 1.0 --package-id $CC_PACKAGE_ID_2 --sequence 1 --tls true --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
# sleep 20
# # Once a sufficient number of channel members have approved a chaincode definition, one member can commit the definition to the channel
# peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name mycc --version 1.0 --init-required --sequence 1 --tls true --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json
peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 1.0 --sequence 1

CORE_PEER_MSPCONFIGPATH=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

peer lifecycle chaincode commit -o orderer.example.com:7050 --channelID $CHANNEL_NAME --name papercontract --version 1.0 --sequence 1 \
  --tls true \
  --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses peer0.org2.example.com:9051 \
  --tlsRootCertFiles /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
  --waitForEvent

peer chaincode invoke -o orderer.example.com:7050  --tls true \
  --cafile /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses peer0.org1.example.com:7051 \
  --tlsRootCertFiles /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses peer0.org2.example.com:9051 \
  --tlsRootCertFiles /home/zy/go/src/github.com/hyperledger/fabric-samples/first-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
  --channelID mychannel --name papercontract \
  -c '{"Args":["org.papernet.commercialpaper:instantiate"]}'  \
  --waitForEvent

peer chaincode query --channelID mychannel \
                                        --name papercontract \
                                        -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}'

# peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'                                          


set +x
