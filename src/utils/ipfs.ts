import { handlerContext } from "generated";

type NftMetadata = {
  image: string;
  attributes: Array<any>;
};

const BASE_URI_UID = "QmVHMW4pSJ1ZMA5fg74wMP6UC2BtzNVDPHEQZ734hjZUmS";

async function fetchFromEndpoint(
  endpoint: string,
  tokenId: string,
  context: handlerContext
): Promise<NftMetadata | null> {
  try {
    const response = await fetch(`${endpoint}/${BASE_URI_UID}/${tokenId}.json`);
    if (response.ok) {
      const metadata: any = await response.json();
      context.log.info(metadata);
      return { attributes: metadata.attributes, image: metadata.image };
    } else {
      throw new Error("Unable to fetch from endpoint");
    }
  } catch (e) {
    context.log.warn(`Unable to fetch from ${endpoint}`);
  }
  return null;
}

export async function tryFetchIpfsFile(
  tokenId: string,
  context: handlerContext
): Promise<NftMetadata> {
  const endpoints = [
    "https://white-generous-shark-171.mypinata.cloud/ipfs",
    "https://ipfs.io/ipfs",
  ];

  for (const endpoint of endpoints) {
    const metadata = await fetchFromEndpoint(endpoint, tokenId, context);
    if (metadata) {
      return metadata;
    }
  }

  context.log.error("Unable to fetch from all endpoints"); // could do something more here depending on use case
  return { attributes: ["unknown"], image: "unknown" };
}