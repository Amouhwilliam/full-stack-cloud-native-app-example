import { Base } from "./base";
import { applyMixins } from "./utils";
import { Devices } from "./devices";

class ApiSDK extends Base{}
interface ApiSDK extends Devices{}
applyMixins(ApiSDK, [Devices]);
export default ApiSDK;
export * as types from "./devices/types"