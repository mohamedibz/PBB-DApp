import { ethers, Contract } from 'ethers';
import factoryABI from './abis/factoryABI.json';
import ABILoader from './ABILoader';


class PBBFactoryService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contract: Contract;
  private readonly FactoryAddress: String;

  constructor(provider: any, signer?: ethers.Signer) {
    this.FactoryAddress = "0x52e2FD6E436f5E2aE4675260638D57a331c79514"
    this.provider = provider;
    this.signer = signer || provider.getSigner();
    this.contract = new Contract(this.FactoryAddress as string, factoryABI, this.signer);
  }

  async createPBB(version: number, name: string, authUsers: string[]): Promise<void> {
    const tx = await this.contract.createPBB('1', name);
    const receipt = await tx.wait();
    ///const receipt = await tx.wait();
    console.log('PBB creada:', name);

    let pbbAddress;
    for (const log of receipt.logs) {
      try {
        const parsedLog = this.contract.interface.parseLog(log);
        if (parsedLog!.name === "PBBCreated") {
          pbbAddress = parsedLog!.args[1];
          break;
        }
      } catch (error) {
        continue;
      }
    }

    console.log("Dirección del PBB creada:", pbbAddress);

    // Crear una instancia del contrato PBB para agregar usuarios autorizados
    const pbbContract = new Contract(pbbAddress, ABILoader.getABI(version), this.signer);
    await pbbContract.addMembers(authUsers);
    
  }
}

export default PBBFactoryService;
