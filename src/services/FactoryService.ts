import { ethers, Contract } from 'ethers';
import { FactoryAbi, FactoryAddress } from './config2';

class PBBFactoryService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contract: Contract;

  constructor(provider: any, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || provider.getSigner();
    this.contract = new Contract(FactoryAddress, FactoryAbi, this.signer);
  }

  async createPBB(name: string, authUsers: string[]): Promise<void> {
    const tx = await this.contract.createPBB('1', '0x96830aa725883ee6F78Ea6fD0aeF561F51aD7D00', name, authUsers);
    await tx.wait();
    console.log('PBB creada:', name);
  }
}

export default PBBFactoryService;
