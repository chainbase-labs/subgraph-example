import {
  Transfer as TransferEvent,
  BAYC,
} from "../generated/BAYC/BAYC"
import {
  BoredApe,
  Transfer,
  Property
} from "../generated/schema"

import { ipfs, json } from '@graphprotocol/graph-ts'

function initializeTransfer(event: TransferEvent): Transfer {
  return new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()));
}

function handleBoredApe(event: TransferEvent, contractAddress: BAYC): BoredApe {
  let boredApe = BoredApe.load(event.params.tokenId.toString());
  if (boredApe == null) {
    boredApe = new BoredApe(event.params.tokenId.toString());
    boredApe.creator = event.params.to;
    boredApe.tokenURI = contractAddress.tokenURI(event.params.tokenId);
  }

  if (boredApe) {
    boredApe.newOwner = event.params.to;
    boredApe.blockNumber = event.block.number;
  }
  return boredApe
}

function handleProperty(event: TransferEvent, ipfshash: string): Property | null {
  const fullURI = ipfshash + "/" + event.params.tokenId.toString();
  let ipfsData = ipfs.cat(fullURI);

  if (!ipfsData) return null;

  let ipfsValues = json.fromBytes(ipfsData).toObject();
  if (!ipfsValues) return null;

  let property = Property.load(event.params.tokenId.toString()) || new Property(event.params.tokenId.toString());

  if (property) {
    let imageValue = ipfsValues.get('image');
    if (imageValue) {
      property.image = imageValue.toString();
    }

    let attributeArray = ipfsValues.get('attributes');
    if (attributeArray) {
      let attributes = attributeArray.toArray();
      for (let i = 0; i < attributes.length; i++) {
        let attributeObject = attributes[i].toObject();
        let trait = attributeObject.get('trait_type');
        let value = attributeObject.get('value');

        if (trait && value) {
          let traitString = trait.toString();
          let valueString = value.toString();

          if (traitString == "Background") {
            property.background = valueString;
          } else if (traitString == "Clothes") {
            property.clothes = valueString;
          } else if (traitString == "Earring") {
            property.earring = valueString;
          } else if (traitString == "Eyes") {
            property.eyes = valueString;
          } else if (traitString == "Fur") {
            property.fur = valueString;
          } else if (traitString == "Hat") {
            property.hat = valueString;
          } else if (traitString == "Mouth") {
            property.mouth = valueString;
          }
        }

      }
    }

  }
  return property;
}


export function handleTransfer(event: TransferEvent): void {
  const ipfshash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

  let transfer = initializeTransfer(event);
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.tokenId = event.params.tokenId
  transfer.blockNumber = event.block.number
  transfer.transactionHash = event.transaction.hash
  transfer.save();

  let contractAddress = BAYC.bind(event.address);
  handleBoredApe(event, contractAddress).save();

  let property = handleProperty(event, ipfshash);
  if (property) {
    property.save();
  }

}