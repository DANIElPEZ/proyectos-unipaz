type FieldType = "text" | "email" | "password" | "select" | "date" | "multiselect" | "file";

interface FieldSchema {
  name: string
  label: string
  type: FieldType
  options?: { value: any; label: string }[]
  disabledOnEdit?: boolean
}

export interface ModalSchema {
  titleCreate: string
  titleEdit: string
  submitCreateLabel: string
  submitEditLabel: string
  fields: FieldSchema[]
}

//admin
export const userModalSchema: ModalSchema = {
  titleCreate: "Crear usuario",
  titleEdit: "Editar usuario",
  submitCreateLabel: "Crear usuario",
  submitEditLabel: "Actualizar usuario",
  fields: [
    { name: "name", label: "Nombre *", type: "text" },
    { name: "id_document", label: "Documento *", type: "text" },
    {
      name: "id_role",
      label: "Rol *",
      type: "select",
    },
    { name: "email", label: "Email *", type: "email" },
    { name: "password", label: "Contraseña *", type: "password" },
    {
      name: "program",
      label: "Programa *",
      type: "select",
    },
    {
      name: "id_status",
      label: "Estado *",
      type: "select",
    },
    {
      name: "id_school",
      label: "Escuela *",
      type: "select",
    },
  ],
}

export const schoolModalSchema: ModalSchema = {
  titleCreate: "Crear escuela",
  titleEdit: "Editar escuela",
  submitCreateLabel: "Crear",
  submitEditLabel: "Actualizar",
  fields: [{ name: "name", label: "Nombre *", type: "text" }],
}

export const programModalSchema: ModalSchema = {
  titleCreate: "Crear programa",
  titleEdit: "Editar programa",
  submitCreateLabel: "Crear",
  submitEditLabel: "Actualizar",
  fields: [
    { name: "name", label: "Nombre *", type: "text" },
    {
      name: "id_school",
      label: "Escuela *",
      type: "select",
    },
  ],
}

//manager
export const statusUserModalSchema: ModalSchema = {
  titleCreate: "Actualizar estatus del usuario",
  titleEdit: "Actualizar estado del estudiante",
  submitCreateLabel: "Crear",
  submitEditLabel: "Actualizar",
  fields: [
    {
      name: "id_status",
      label: "Estatus",
      type: "select",
    },
  ],
}

export const projectModalSchema: ModalSchema = {
  titleCreate: "Crear proyecto",
  titleEdit: "Editar proyecto",
  submitCreateLabel: "Crear proyecto",
  submitEditLabel: "Actualizar proyecto",
  fields: [
    { name: "title", label: "Nombre *", type: "text" },
    { name: "description", label: "Descripción *", type: "text" },
    { name: "is_best", label: "Gran proyecto", type: "text" },
    {
      name: "id_program",
      label: "Programa *",
      type: "select",
    },
    {
      name: "id_school",
      label: "Escuela *",
      type: "select",
    },
    {
      name: "id_mode",
      label: "tipo de proyecto *",
      type: "select",
    },
    {
      name: "initial_date",
      label: "Fecha inicial *",
      type: "date",
    },
    {
      name: "id_professors *",
      label: "Profesores",
      type: "multiselect",
    },
    {
      name: "id_students *",
      label: "Estudiantes",
      type: "multiselect",
    },
  ],
}

export const phaseModalSchema: ModalSchema = {
  titleCreate: "Actualizar fase del proyecto",
  titleEdit: "Actualizar fase del proyecto",
  submitCreateLabel: "Actualizar proyecto",
  submitEditLabel: "Actualizar proyecto",
  fields: [
    {
      name: "id_work *",
      label: "titulo del proyecto",
      type: "select",
    },
    {
      name: "id_phase *",
      label: "Fase",
      type: "select",
    },
    {
      name: "initial_date *",
      label: "Fecha inicial",
      type: "date",
    },
    {
      name: "id_professors *",
      label: "Profesores",
      type: "multiselect",
    },
    {
      name: "id_students *",
      label: "Estudiantes",
      type: "multiselect",
    },
  ],
}

export const phaseProjectDateModalSchema: ModalSchema = {
  titleCreate: "Actualizar fecha fin",
  titleEdit: "Actualizar fecha fin",
  submitCreateLabel: "Actualizar fecha",
  submitEditLabel: "Actualizar",
  fields: [
    {
      name: "id_work *",
      label: "titulo del proyecto",
      type: "select",
    },
    {
      name: "id_phase *",
      label: "Fase del proyecto",
      type: "select",
    },
    {
      name: "end_date *",
      label: "Fin de la fase",
      type: "date",
    },
  ],
}

export const studentAdvanceModalSchema: ModalSchema = {
  titleCreate: "Nuevo avance",
  titleEdit: "Editar avance",
  submitCreateLabel: "Subir avance",
  submitEditLabel: "Actualizar",
  fields: [
    {
      name: "file",
      label: "Archivo word o excel *",
      type: "file",
    },
    {
      name: "version",
      label: "version *",
      type: "text",
    },
    {
      name: "description",
      label: "Descripción",
      type: "text",
    },
  ],
};

export const professorFeedbackModalSchema: ModalSchema = {
  titleCreate: "Nuevo avance",
  titleEdit: "Editar avance",
  submitCreateLabel: "Subir avance",
  submitEditLabel: "Actualizar",
  fields: [
    {
      name: "file",
      label: "Archivo word o excel *",
      type: "file",
    },
    {
      name: "professor_comments",
      label: "Comentarios del profesor",
      type: "text",
    },
  ],
};