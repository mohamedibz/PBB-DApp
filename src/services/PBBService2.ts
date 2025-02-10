import { ethers, Contract } from 'ethers';
import ABILoader from './ABILoader';
import { graphClient } from './graphClient';

interface PBB {
  id: string;
  name: string;
  timestamp: string;
  creator: { id: string };
}

class PBBService2 {

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
          }
        }
      }
    `;
    
    const data = await graphClient.query(query, { id: pbbAddress.toLowerCase() }); // Asegúrate de que el address esté en minúsculas
    return data.pbb ? data.pbb.messages : [];
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

  getContractInstance(pbbAddress: string, version: string): Contract {
    const abi = ABILoader.getABI(version);
    return new Contract(pbbAddress, abi, this.signer);
  }

  async addMessageToPBB(pbbAddress: string, version: string, content: string, topic: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addMessage(content, topic);
    await tx.wait();
    console.log('Mensaje agregado a la PBB');
  }

  async authorizeUserToPBB(pbbAddress: string, version: string, newUser: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.addAuthorizedUser(newUser);
    await tx.wait();
    console.log('Usuario autorizado en la PBB');
  }

  async revokeUserToPBB(pbbAddress: string, version: string, user: string): Promise<void> {
    const contract = this.getContractInstance(pbbAddress, version);
    const tx = await contract.removeAuthorizedUser(user);
    await tx.wait();
    console.log('Usuario revocado en la PBB');
  }

  async getAuthorizedUsersByPBB(pbbAddress: string): Promise<string[]> {
    const query = `
      query GetAuthorizedUsers($id: ID!) {
        pbb(id: $id) {
          authorizedUsers {
            id
          }
        }
      }
    `;
  
    try {
      const data = await graphClient.query(query, { id: pbbAddress.toLowerCase() });
  
      // Aseguramos que `authorizedUsers` es un array de objetos con el campo `id`
      const users = data.pbb && Array.isArray(data.pbb.authorizedUsers)
        ? data.pbb.authorizedUsers.map((user: { id: string }) => user.id)
        : [];
  
      return users;
    } catch (error) {
      console.error("Error al cargar usuarios autorizados:", error);
      return [];
    }
  }
  
}

export default PBBService2;

export { PBB };