import { v4 } from "uuid";

export default class IdGeneratorUtils {
    generateId = (): string => v4()
}
