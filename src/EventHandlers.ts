import {
  DragonZ,
  DragonZ_Approval,
  DragonZ_ApprovalForAll,
  DragonZ_BatchMetadataUpdate,
  DragonZ_MetadataUpdate,
  DragonZ_OwnershipTransferred,
  DragonZ_Transfer,
  NetZFinance,
  NetZFinance_Approval,
  NetZFinance_AutoLiquify,
  NetZFinance_OwnershipTransferred,
  NetZFinance_Transfer,
} from "generated";
import { tryFetchIpfsFile } from "./utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

DragonZ.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
    // mint
    let metadata = await tryFetchIpfsFile(
      event.params.tokenId.toString(),
      context
    );

    const nft: Nft = {
      id: event.params.tokenId.toString(),
      owner: event.params.to,
      from: ZERO_ADDRESS,
      to: event.params.to,
      image: metadata.image,
      attributes: JSON.stringify(metadata.attributes),
    };
    context.Nft.set(nft);
  } else {
    // transfer
    let nft = await context.Nft.get(event.params.tokenId.toString());
    if (!nft) {
      throw new Error("Can't transfer non-existing NFT");
    }
    nft = {
      ...nft,
      owner: event.params.to,
      from: event.params.from,
      to: event.params.to,
    };
    context.Nft.set(nft);
  }
});

DragonZ.Approval.handler(async ({ event, context }) => {
  const entity: DragonZ_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.DragonZ_Approval.set(entity);
});

DragonZ.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: DragonZ_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.DragonZ_ApprovalForAll.set(entity);
});

DragonZ.BatchMetadataUpdate.handler(async ({ event, context }) => {
  const entity: DragonZ_BatchMetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _fromTokenId: event.params._fromTokenId,
    _toTokenId: event.params._toTokenId,
  };

  context.DragonZ_BatchMetadataUpdate.set(entity);
});

DragonZ.MetadataUpdate.handler(async ({ event, context }) => {
  const entity: DragonZ_MetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _tokenId: event.params._tokenId,
  };

  context.DragonZ_MetadataUpdate.set(entity);
});

DragonZ.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: DragonZ_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.DragonZ_OwnershipTransferred.set(entity);
});

NetZFinance.Approval.handler(async ({ event, context }) => {
  const entity: NetZFinance_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
  };

  context.NetZFinance_Approval.set(entity);
});

NetZFinance.AutoLiquify.handler(async ({ event, context }) => {
  const entity: NetZFinance_AutoLiquify = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    amountNETZ: event.params.amountNETZ,
    amountBOG: event.params.amountBOG,
  };

  context.NetZFinance_AutoLiquify.set(entity);
});

NetZFinance.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: NetZFinance_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.NetZFinance_OwnershipTransferred.set(entity);
});

NetZFinance.Transfer.handler(async ({ event, context }) => {
  const entity: NetZFinance_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
  };

  context.NetZFinance_Transfer.set(entity);
});