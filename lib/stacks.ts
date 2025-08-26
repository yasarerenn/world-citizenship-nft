import { 
  callReadOnlyFunction, 
  cvToValue, 
  stringAsciiCV, 
  stringUtf8CV,
  uintCV,
  principalCV,
  someCV,
  noneCV,
  tupleCV,
  listCV,
  standardPrincipalCV,
  contractPrincipalCV
} from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

// Devnet için local contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const CONTRACT_NAME = 'world-citizenship-nft'
const DAO_CONTRACT_NAME = 'world-citizenship-dao'

// Devnet için local network configuration
export const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' 
  ? new StacksMainnet() 
  : new StacksTestnet({ url: 'http://localhost:20443' })

export const appDetails = {
  name: 'Dünya Vatandaşlığı NFT',
  icon: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=🌍',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
}

export interface CitizenshipMetadata {
  name: string
  description: string
  imageUri: string
  attributes: Array<{key: string, value: string}>
  citizenshipDate: number
  citizenId: string
}

export interface CitizenshipStatus {
  hasCitizenship: boolean
  tokenId?: number
  metadata?: CitizenshipMetadata
}

// Kullanıcının vatandaşlık durumunu kontrol et
export async function checkCitizenshipStatus(userAddress: string): Promise<CitizenshipStatus> {
  try {
    const hasCitizenship = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'has-citizenship',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    })

    if (cvToValue(hasCitizenship)) {
      // Kullanıcının NFT'si var, token ID'sini al
      const tokenId = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-user-token-id',
        functionArgs: [standardPrincipalCV(userAddress)],
        senderAddress: userAddress,
      })

      const tokenIdValue = cvToValue(tokenId)
      
      if (tokenIdValue) {
        // Metadata'yı al
        const metadata = await callReadOnlyFunction({
          network,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-token-metadata',
          functionArgs: [uintCV(tokenIdValue)],
          senderAddress: userAddress,
        })

        const metadataValue = cvToValue(metadata)
        
        return {
          hasCitizenship: true,
          tokenId: tokenIdValue,
          metadata: metadataValue ? parseMetadata(metadataValue) : undefined
        }
      }
    }

    return {
      hasCitizenship: false
    }
  } catch (error) {
    console.error('Vatandaşlık durumu kontrol edilemedi:', error)
    return {
      hasCitizenship: false
    }
  }
}

// Toplam arzı al
export async function getTotalSupply(): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-total-supply',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    })

    return cvToValue(result) || 0
  } catch (error) {
    console.error('Toplam arz alınamadı:', error)
    return 0
  }
}

// NFT sahibini kontrol et
export async function getTokenOwner(tokenId: number): Promise<string | null> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-owner',
      functionArgs: [uintCV(tokenId)],
      senderAddress: CONTRACT_ADDRESS,
    })

    return cvToValue(result) || null
  } catch (error) {
    console.error('Token sahibi alınamadı:', error)
    return null
  }
}

// DAO oy hakkı kontrolü
export async function canVoteInDao(userAddress: string): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'can-vote-in-dao',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    })

    return cvToValue(result) || false
  } catch (error) {
    console.error('DAO oy hakkı kontrol edilemedi:', error)
    return false
  }
}

// Evrensel kimlik doğrulama
export async function verifyWorldCitizen(userAddress: string): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'verify-world-citizen',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    })

    return cvToValue(result) || false
  } catch (error) {
    console.error('Dünya vatandaşı doğrulaması yapılamadı:', error)
    return false
  }
}

// Metadata'yı parse et
function parseMetadata(rawMetadata: any): CitizenshipMetadata {
  return {
    name: rawMetadata.name || '',
    description: rawMetadata.description || '',
    imageUri: rawMetadata['image-uri'] || '',
    attributes: rawMetadata.attributes || [],
    citizenshipDate: rawMetadata['citizenship-date'] || 0,
    citizenId: rawMetadata['citizen-id'] || ''
  }
}

// NFT mint işlemi için gerekli parametreleri hazırla
export function prepareMintParams(name: string, description: string, imageUri: string) {
  return [
    stringAsciiCV(name),
    stringUtf8CV(description),
    stringAsciiCV(imageUri || '')
  ]
}

// Gerçek blockchain işlemi için contract call parametreleri
export function prepareMintContractCall(userAddress: string, name: string, description: string, imageUri: string) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'mint-citizenship',
    functionArgs: [
      stringAsciiCV(name),
      stringUtf8CV(description),
      stringAsciiCV(imageUri || '')
    ],
    senderAddress: userAddress,
    network,
    postConditionMode: 1, // PostConditionMode.Deny
    anchorMode: 3
  }
}

// DAO işlemleri için contract call parametreleri
export function prepareCreateProposalContractCall(
  userAddress: string, 
  title: string, 
  description: string, 
  proposalType: string, 
  options: string[], 
  duration: number, 
  fee: number
) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: DAO_CONTRACT_NAME,
    functionName: 'create-proposal',
    functionArgs: [
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(proposalType),
      listCV(options.map(opt => stringAsciiCV(opt))),
      uintCV(duration),
      uintCV(fee)
    ],
    senderAddress: userAddress,
    network,
    postConditionMode: 1,
    anchorMode: 3
  }
}

export function prepareVoteContractCall(
  userAddress: string,
  proposalId: number,
  choice: string
) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: DAO_CONTRACT_NAME,
    functionName: 'vote',
    functionArgs: [
      uintCV(proposalId),
      stringAsciiCV(choice)
    ],
    senderAddress: userAddress,
    network,
    postConditionMode: 1,
    anchorMode: 3
  }
}
