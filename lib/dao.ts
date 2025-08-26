import { 
  makeContractCall, 
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  listCV,
  uintCV,
  PostConditionMode,
  StacksTestnet
} from '@stacks/transactions'
import { network } from './stacks'

const DAO_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.world-citizenship-dao'

// DAO parametrelerini getir
export const getDAOParams = async () => {
  try {
    // Burada gerçek contract çağrısı yapılacak
    return {
      defaultDuration: 259200, // 3 gün
      minProposalFee: 1000000, // 1 STX
      quorumPercentage: 20
    }
  } catch (error) {
    console.error('DAO parametreleri alınamadı:', error)
    throw error
  }
}

// Teklif oluştur
export const createProposal = async (
  sender: string,
  title: string,
  description: string,
  proposalType: string,
  options: string[],
  duration: number,
  fee: number
) => {
  try {
    const functionArgs = [
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(proposalType),
      listCV(options.map(option => stringAsciiCV(option))),
      uintCV(duration),
      uintCV(fee)
    ]

    const transaction = await makeContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'world-citizenship-dao',
      functionName: 'create-proposal',
      functionArgs,
      senderAddress: sender,
      postConditionMode: PostConditionMode.Allow,
      network
    })

    return transaction
  } catch (error) {
    console.error('Teklif oluşturma hatası:', error)
    throw error
  }
}

// Oy kullan
export const vote = async (
  sender: string,
  proposalId: number,
  choice: string
) => {
  try {
    const functionArgs = [
      uintCV(proposalId),
      stringAsciiCV(choice)
    ]

    const transaction = await makeContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'world-citizenship-dao',
      functionName: 'vote',
      functionArgs,
      senderAddress: sender,
      postConditionMode: PostConditionMode.Allow,
      network
    })

    return transaction
  } catch (error) {
    console.error('Oy kullanma hatası:', error)
    throw error
  }
}

// Teklif uygula
export const executeProposal = async (
  sender: string,
  proposalId: number
) => {
  try {
    const functionArgs = [uintCV(proposalId)]

    const transaction = await makeContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'world-citizenship-dao',
      functionName: 'execute-proposal',
      functionArgs,
      senderAddress: sender,
      postConditionMode: PostConditionMode.Allow,
      network
    })

    return transaction
  } catch (error) {
    console.error('Teklif uygulama hatası:', error)
    throw error
  }
}

// Teklif bilgilerini getir
export const getProposal = async (proposalId: number) => {
  try {
    // Burada gerçek contract çağrısı yapılacak
    return null
  } catch (error) {
    console.error('Teklif bilgileri alınamadı:', error)
    throw error
  }
}

// Oy bilgilerini getir
export const getVotes = async (proposalId: number) => {
  try {
    // Burada gerçek contract çağrısı yapılacak
    return {}
  } catch (error) {
    console.error('Oy bilgileri alınamadı:', error)
    throw error
  }
}

// Toplam teklif sayısını getir
export const getProposalCount = async () => {
  try {
    // Burada gerçek contract çağrısı yapılacak
    return 3
  } catch (error) {
    console.error('Teklif sayısı alınamadı:', error)
    throw error
  }
}
