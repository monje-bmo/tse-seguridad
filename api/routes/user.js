// api/routes/usuarios.js
import { Router } from "express";
import {
  getAll,
  getByIdUser,
  getAllInfoUser,
  updateUser,
  deleteUser,
  getEmpleados,
  createUser
} from "../controllers/usuariosController.js";

import { getAllCargos, getAllRoles } from "../controllers/dataController.js";

const router = Router();

router.route("/").get(getAll).post(createUser);
router.route("/cargos").get(getAllCargos);
router.route("/roles").get(getAllRoles);
router.route("/empleados").get(getEmpleados);
router.route("/allinfo/:id").get(getAllInfoUser);
router.route("/:id").get(getByIdUser).put(updateUser).delete(deleteUser);

export default router;
