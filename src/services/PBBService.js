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
        topic: event.args.topic,
        content: event.args.content,
        date: event.args.timestamp,
        txHash: event.transactionHash,
      }));
    } catch (error) {
      console.error("Error al obtener eventos pasados:", error);
      throw error;
    }
  }

  // Método para obtener eventos pasados de MessageAdded y devolver tópicos únicos
  async getTopics(pbbId) {
    try {
      const filter = this.contract.filters.MessageAdded(getBigInt(pbbId));
      const events = await this.contract.queryFilter(filter, 0, "latest");

      // Extraer los tópicos de los eventos y eliminar duplicados usando Set
      const uniqueTopics = Array.from(
        new Set(events.map(event => event.args.topic))
      );

      return uniqueTopics;
    } catch (error) {
      console.error("Error al obtener los tópicos:", error);
      throw error;
    }
  }

  // Método para crear una nueva PBB
  async createPBB(name, authUsers) {
    try {
      const tx = await this.contract.createPBB(1, name, authUsers);
      await tx.wait();
      console.log("PBB creada exitosamente:", name);
    } catch (error) {
      console.error("Error al crear PBB:", error);
      throw error;
    }
  }

  // Método para agregar un mensaje a una PBB específica
  async addMessageToPBB(pbbId, content, topic) {
    try {
      const tx = await this.contract.addMessageToPBB(pbbId, content, topic);
      await tx.wait();
      console.log("Mensaje agregado a la PBB:", content);
    } catch (error) {
      console.error("Error al agregar mensaje:", error);
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
      let authorizedPbbIds = events.map(event => event.args.pbbId);
      authorizedPbbIds = [...new Set(authorizedPbbIds)]

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


        // Combina todos los eventos en un solo arreglo
        const eventos = [...authEvents, ...revokeEvents];

        // Ordena los eventos cronológicamente por el timestamp
        eventos.sort((a, b) => {
            return Number(a.args.timestamp) - Number(b.args.timestamp);
        });

        /*
        console.log("Eventos ordenados por timestamp:");
        console.log('====================================================')
        eventos.forEach((event, index) => {
            console.log(`Evento ${index + 1}:`);
            console.log("  Tipo:", event.fragment.name);
            console.log("  User:", event.args.newUser || event.args.user);
            console.log("  Tiempo:", event.args.timestamp);
        });
        console.log('====================================================')
        */

        // Usa un Set para manejar usuarios autorizados de forma única
        const authorizedUsersSet = new Set();

        // Procesa los eventos en orden cronológico
        eventos.forEach(event => {
          if (event.fragment.name === "UserAuthorized") {
              authorizedUsersSet.add(event.args.newUser);
          } else if (event.fragment.name === "UserRevoked") {
              authorizedUsersSet.delete(event.args.user);
          }
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

  // Método para transferir el rol de administrador de un PBB
  async transferAdmin(pbbId, newAdmin) {
    try {
      const tx = await this.contract.transferAdminOfPBB(pbbId, newAdmin);
      await tx.wait(); // Espera la confirmación de la transacción
      console.log(`Administrador transferido a: ${newAdmin} para el PBB con ID ${pbbId}`);
      return tx.hash; // Devuelve el hash de la transacción
    } catch (error) {
      console.error("Error al transferir administrador:", error);
      throw error;
    }
  }

}

export default PBBService;
