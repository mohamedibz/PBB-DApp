import PBBAbiV1 from './abis/PBBV1.json';
import PBBAbiV2 from './abis/PBBV2.json';

class ABILoader {
  static getABI(version: number): any {
    switch (version) {
      case 1:
        return PBBAbiV1;
      case 2:
        return PBBAbiV2;
      default:
        throw new Error(`ABI no encontrado para la versión ${version}`);
    }
  }
}

export default ABILoader;
