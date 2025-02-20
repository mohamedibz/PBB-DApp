import { ethers, Contract } from 'ethers';
import ABILoader from './ABILoader';
import { graphClient } from './graphClient';

interface PBB {
  id: string;
  name: string;
  timestamp: string;
  creator: { id: string };
}

class PBBService {

  private provider: any;
  private signer: ethers.Signer;

  constructor(provider: any, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || provider.getSigner();
  }

  async getMessagesByPBB(pbbAddress: string): Promise<any[]> {
    const query = `
      query GetMessages($id: ID!) {
        pbb(id: $id) {
          messages {
            id
            sender {
              id
            }
            topic
            content
            timestamp
            txHash
          }
        }
      }
    `;
    
    const data = await graphClient.query(query, { id: pbbAddress.toLowerCase() }); // Asegúrate de que el address esté en minúsculas
    return data.pbb ? data.pbb.messages : [];
  }

  async getAuthorizedUsersByPBB(pbbAddress: string): Promise<string[]> {
    const query = `
      query GetAuthorizedUsers($id: ID!) {
        pbb(id: $id) {
          members {
            id
          }
        }
      }
    `;
  
    try {
      const data = await graphClient.query(query, { id: pbbAddress.toLowerCase() });
  
      // Aseguramos que `authorizedUsers` es un array de objetos con el campo `id`
      const users = data.pbb && Array.isArray(data.pbb.members)
        ? data.pbb.members.map((user: { id: string }) => user.id)
        : [];
  
      return users;
    } catch (error) {
      console.error("Error al cargar usuarios autorizados:", error);
      return [];
    }
  }

  async getAdminsByPBB(pbbAddress: string): Promise<string[]> {
    const query = `
      query GetAdmins($id: ID!) {
        pbb(id: $id) {
          admins {
            id
          }
        }
      }
    `;
  
    try {
      const data = await graphClient.query(query, { id: pbbAddress.toLowerCase() });
  
      // Aseguramos que admins es un array de objetos con el campo id
      const admins = data.pbb && Array.isArray(data.pbb.admins)
        ? data.pbb.admins.map((admin: { id: string }) => admin.id)
        : [];
  
      return admins;
    } catch (error) {
      console.error("Error al cargar administradores:", error);
      return [];
    }
  }
  

  async getTopicsByPBB(pbbAddress: string): Promise<string[]> {
    const query = `
      query GetTopics($id: ID!) {
        pbb(id: $id) {
          messages {
            topic
          }
        }
      }
    `;
  
    try {
      const data = await graphClient.query(query, { id: pbbAddress.toString().toLowerCase() }); // Asegura que el address esté en minúsculas
      const topics = data.pbb && data.pbb.messages ? data.pbb.messages.map((msg: { topic: any; }) => msg.topic) : [];
  
      // Eliminar duplicados
      return Array.from( new Set(topics));
    } catch (error) {
      console.error("Error al cargar tópicos:", error);
      return [];
    }
  }
  
  async getCreatedPBBsByUser(userId: string): Promise<PBB[]> {
    const query = `
      query GetCreatedPBBs($id: ID!) {
        user(id: $id) {
          createdPBBs {
            id
            name
            timestamp
            creator {
              id
            }
          }
        }
      }
    `;
    const data = await graphClient.query(query, { id: userId });
    return data.user ? data.user.createdPBBs : [];
  }
  
  async getAuthorizedPBBsByUser(userId: string): Promise<PBB[]> {
    const query = `
      query GetAuthorizedPBBs($id: ID!) {
        user(id: $id) {
          authorizedPBBs {
            id
            name
            timestamp
            creator {
              id
            }
          }
        }
      }
    `;
    const data = await graphClient.query(query, { id: userId });
    console.log("AVERQEEEE: " + data.user.authorizedPBBs[0].id)
    return data.user ? data.user.authorizedPBBs : [];
  }
  
  async getAllPBBs(): Promise<PBB[]> {
    const query = `
      query GetAllPBBs {
        pbbs {
          id
          name
          timestamp
          creator {
            id
          }
        }
      }
    `;
    const data = await graphClient.query(query);
    return data.pbbs;
  }

  getContractInstance(pbbAddress: string, version: number): Contract {
    const abi = ABILoader.getABI(version);
    return new Contract(pbbAddress, abi, this.signer);
  }

  async addMessageToPBB(pbbAddress: string, version: number, content: string, topic: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addMessage(content, topic);
    await tx.wait();
    console.log('Mensaje agregado a la PBB');
  }

  async authorizeUserToPBB(pbbAddress: string, version: number, newUser: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addMember(newUser);
    await tx.wait();
    console.log('Usuario autorizado en la PBB');
  }

  async revokeUserToPBB(pbbAddress: string, version: number, user: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.removeMember(user);
    await tx.wait();
    console.log('Usuario revocado en la PBB');
  }

  async addAdminToPBB(pbbAddress: string, version: number, newAdmin: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addAdmin(newAdmin);
    await tx.wait();
    console.log('Administrador añadido a la PBB');
  }

  async revokeAdminFromPBB(pbbAddress: string, version: number, newAdmin: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.removeAdmin(newAdmin);
    await tx.wait();
    console.log('Administrador revocado de la PBB');
  }

  async authorizeUsersToPBB(pbbAddress: string, version: number, users: string[]): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addMembers(users);
    await tx.wait();
    console.log('Usuarios autorizados en la PBB');
  }

}

export default PBBService;

export { PBB };