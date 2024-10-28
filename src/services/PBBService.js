import { Contract } from "ethers";
import { PBBAbi, PBBAddress } from "./config.js";
import { getBigInt } from "ethers";

class PBBService {
  constructor(provider, signer) {
    // Inicializa el provider y signer, y verifica que ambos estén configurados
    if (!provider) {
      throw new Error("Provider es requerido para conectar con la red.");
    }
    
    this.provider = provider;
    this.signer = signer || provider.getSigner(); // Usa el signer o el provider si no hay signer

    // Instancia del contrato usando el signer
    this.contract = new Contract(PBBAddress, PBBAbi, this.signer);
  }

  // Método para obtener todos los eventos PBBCreated
  async getCreatedBoards() {
    try {
      const filter = this.contract.filters.PBBCreated();
      const events = await this.contract.queryFilter(filter, 0, "latest");

      return events.map(event => ({
        pbbId: event.args.pbbId,
        creator: event.args.creator,
        name: event.args.name,
        date: event.args.timestamp
      }));
    } catch (error) {
      console.error("Error al obtener eventos de creación:", error);
      throw error;
    }
  }

  // Método para obtener eventos pasados de PBBCreated
  async getMessagesEvents(pbbId) {
    try {
      const filter = this.contract.filters.MessageAdded(getBigInt(pbbId));
      const events = await this.contract.queryFilter(filter, 0, "latest");

      return events.map(event => ({
        sender: event.args.sender,
        content: event.args.content,
        date: event.args.timestamp,
        txHash: event.transactionHash,
      }));
    } catch (error) {
      console.error("Error al obtener eventos pasados:", error);
      throw error;
    }
  }


  // Método para obtener eventos específicos de PBB
  async getMyBoards(pbbId) {
    try {
      const filter = this.contract.filters.PBBCreated();
      const events = await this.contract.queryFilter(filter, 0, "latest");
      return events.map(event => ({
        pbbId: event.args.id.toString(),
        content: event.args.creator,
        sender: event.args.pbbAddress,
      }));
    } catch (error) {
      console.error("Error al obtener eventos de boards:", error);
      throw error;
    }
  }

  // Método para crear una nueva PBB
  async createPBB(name, authUsers) {
    try {
      const tx = await this.contract.createPBB(name, authUsers);
      await tx.wait();
      console.log("PBB creada exitosamente:", name);
    } catch (error) {
      console.error("Error al crear PBB:", error);
      throw error;
    }
  }

  // Método para agregar un mensaje a una PBB específica
  async addMessageToPBB(pbbId, content) {
    try {
      const tx = await this.contract.addMessageToPBB(pbbId, content);
      await tx.wait();
      console.log("Mensaje agregado a la PBB:", content);
    } catch (error) {
      console.error("Error al agregar mensaje:", error);
      throw error;
    }
  }

  // Método para obtener un mensaje específico de un PBB
  async getMessageFromPBB(pbbId, messageId) {
    try {
      const message = await this.contract.getMessageFromPBB(pbbId, messageId);
      console.log("Mensaje recuperado:", message);
      return message;
    } catch (error) {
      console.error("Error al obtener mensaje:", error);
      throw error;
    }
  }

  // Método para obtener mensajes paginados de un PBB
  async getMessagesInRangeFromPBB(pbbId, startIndex, endIndex) {
    try {
      const messages = await this.contract.getMessagesInRangeFromPBB(pbbId, startIndex, endIndex);
      console.log("Mensajes recuperados en rango:", messages);
      return messages;
    } catch (error) {
      console.error("Error al obtener mensajes en rango:", error);
      throw error;
    }
  }


//--------------------------------------------------------------------------

  // Método para obtener todos los eventos PBBCreated filtrados por creador
  async getBoardsByCreator(creatorAddress) {
    try {
      const filter = this.contract.filters.PBBCreated(null, null, creatorAddress);
      const events = await this.contract.queryFilter(filter, 0, "latest");
      return events.map(event => ({
        pbbId: event.args.pbbId,
        creator: event.args.creator,
        name: event.args.name,
        date: event.args.timestamp
      }));
    } catch (error) {
      console.error("Error al obtener boards del creador:", error);
      throw error;
    }
  }

  // Método para obtener los IDs de boards en los que el usuario está autorizado
  async getAuthorizedBoards(userAddress) {
    try {
      const filter = this.contract.filters.UserAuthorized(null, null, userAddress);
      const events = await this.contract.queryFilter(filter, 0, "latest");

      // Extraemos todos los pbbIds de los eventos autorizados
      const authorizedPbbIds = events.map(event => event.args.pbbId);

      // Ahora cargamos todos los boards creados que coinciden con esos pbbIds
      const boards = [];
      for (const pbbId of authorizedPbbIds) {
        const boardFilter = this.contract.filters.PBBCreated(pbbId);
        const boardEvents = await this.contract.queryFilter(boardFilter, 0, "latest");
        boardEvents.forEach(boardEvent => {
          boards.push({
            pbbId: boardEvent.args.pbbId,
            creator: boardEvent.args.creator,
            name: boardEvent.args.name,
            date: boardEvent.args.timestamp
          });
        });
      }
      return boards;
    } catch (error) {
      console.error("Error al obtener boards autorizados:", error);
      throw error;
    }
  }

  // Método para obtener los usuarios autorizados actuales a partir de eventos
  async getCurrentAuthorizedUsers(pbbId) {
    try {
        // Filtra eventos de autorización y revocación
        const authFilter = this.contract.filters.UserAuthorized(pbbId);
        const revokeFilter = this.contract.filters.UserRevoked(pbbId);
        
        // Obtén todos los eventos de autorización y revocación
        const authEvents = await this.contract.queryFilter(authFilter, 0, "latest");
        const revokeEvents = await this.contract.queryFilter(revokeFilter, 0, "latest");

        // Usa un Set para manejar usuarios autorizados de forma única
        const authorizedUsersSet = new Set();

        // Procesa los eventos de autorización
        authEvents.forEach(event => {
            authorizedUsersSet.add(event.args.newUser);
        });

        // Procesa los eventos de revocación
        revokeEvents.forEach(event => {
            authorizedUsersSet.delete(event.args.user);
        });

        // Convierte el Set a array para la lista final de usuarios autorizados
        return Array.from(authorizedUsersSet);
    } catch (error) {
        console.error("Error al obtener usuarios autorizados actuales:", error);
        throw error;
    }
  }

  // Método para autorizar un nuevo usuario en un PBB específico
  async authorizeUser(pbbId, userAddress) {
    try {
      const tx = await this.contract.authorizeUser(pbbId, userAddress);
      await tx.wait();  // Espera a que se confirme la transacción
      console.log(`Usuario autorizado: ${userAddress} en PBB con ID ${pbbId}`);
      return tx.hash;  // Devuelve el hash de la transacción
    } catch (error) {
      console.error("Error al autorizar usuario:", error);
      throw error;
    }
  }

  // Método para revocar un usuario de un PBB específico
  async revokeUser(pbbId, userAddress) {
    try {
      const tx = await this.contract.revokeUser(pbbId, userAddress);
      await tx.wait();  // Espera a que se confirme la transacción
      console.log(`Usuario revocado: ${userAddress} de PBB con ID ${pbbId}`);
      return tx.hash;  // Devuelve el hash de la transacción
    } catch (error) {
      console.error("Error al revocar usuario:", error);
      throw error;
    }
  }







}

export default PBBService;
