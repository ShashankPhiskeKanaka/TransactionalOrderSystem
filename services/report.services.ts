import type { reportPgRepositoryClass } from "../repositories/report.repository/report.pgrepository.js";

class reportServicesClass {

    constructor( private reportMethods : reportPgRepositoryClass ) {};

}

export { reportServicesClass }