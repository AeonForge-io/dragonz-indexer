import { DragonZ, Nft } from "generated";
import { tryFetchIpfsFile } from "./utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

DragonZ.Transfer.handler(async ({ event, context }) => {
  const timestamp = event.block.timestamp; // Get block timestamp
  const fromAddress = event.params.from;
  const toAddress = event.params.to;

  if (fromAddress === ZERO_ADDRESS) {
    // mint
    let metadata = await tryFetchIpfsFile(
      event.params.tokenId.toString(),
      context
    );

    const nft: Nft = {
      id: event.params.tokenId.toString(),
      owner: toAddress,
      image: metadata.image,
      attributes: JSON.stringify(metadata.attributes),
      mintedAt: timestamp, // Store mint timestamp
      transferHistory: JSON.stringify([{ from: ZERO_ADDRESS, to: toAddress, timestamp }]), // Initialize history
    };
    context.Nft.set(nft);
  } else {
    // transfer
    let nft = await context.Nft.get(event.params.tokenId.toString());
    if (!nft) {
      throw new Error("Can't transfer non-existing NFT");
    }

    // Update ownership
    nft = { 
      ...nft, 
      owner: toAddress, 
      lastTransferredAt: timestamp // Store last transfer timestamp
    };

    // Append transfer history
    let history = nft.transferHistory ? JSON.parse(nft.transferHistory) : [];
    history.push({ from: fromAddress, to: toAddress, timestamp });
    nft.transferHistory = JSON.stringify(history);

    context.Nft.set(nft);
  }
});
