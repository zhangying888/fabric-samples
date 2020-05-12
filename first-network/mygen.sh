#!/bin/bash

export FABRIC_CFG_PATH=${PWD} 
../bin/cryptogen generate --config=./crypto-config.yaml
./ccp-generate.sh

../bin/configtxgen -profile SampleMultiNodeEtcdRaft -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block

# 在这里channel.tx并没有谁签名 
export CHANNEL_NAME=mychannel  && ../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# 下面两条命令这里也没有签名
../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP

# docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d

