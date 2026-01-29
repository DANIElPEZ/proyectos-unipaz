import {
  userModalSchema,
  schoolModalSchema,
  programModalSchema,
  projectModalSchema,
  phaseProjectDateModalSchema,
  statusUserModalSchema,
  phaseModalSchema,
  studentAdvanceModalSchema,
  professorFeedbackModalSchema
} from "./schemas"

import { insertDataStudent } from "@/src/lib/actions/student/action";
import { updateDataProfessor} from "@/src/lib/actions/professor/action";
import { insertData, updateData, getData } from "@/src/lib/actions/admin/action"
import { createProject, updatePhaseProject, updatePhaseProjectDate, updateProject, updateUserStatus, getCustomData } from "@/src/lib/actions/manager/action"

export const tableConfig: any = {
  users: {
    schema: userModalSchema,
    createAction: async (table_name: string, data: Map<any, any>) => {
      insertData(table_name, data)
    },
    updateAction: async (table_name: string, data: Map<any, any>, id: number) => {
      updateData(table_name, data, id, 'id_user');
    },
    loadRelations: async () => {
      const roles = await getData("roles")
      const programs = await getData("programs")
      const status_user = await getData("status_user")
      const schools = await getData("schools")
      return {
        roles: roles,
        programs: programs,
        status: status_user,
        schools: schools
      }
    },
  },

  schools: {
    schema: schoolModalSchema,
    createAction: async (table_name: string, data: Map<any, any>) => {
      insertData(table_name, data)
    },
    updateAction: async (table_name: string, data: Map<any, any>, id: number) => {
      updateData(table_name, data, id, 'id_school');
    }
  },

  programs: {
    schema: programModalSchema,
    createAction: async (table_name: string, data: Map<any, any>) => {
      insertData(table_name, data)
    },
    updateAction: async (table_name: string, data: Map<any, any>, id: number) => {
      updateData(table_name, data, id, 'id_program');
    },
    loadRelations: async () => {
      const schools = await getData("schools")
      return {
        schools: schools
      }
    },

  },

  Project: {
    schema: projectModalSchema,
    createAction: async (data: Map<any, any>) => {
      createProject(data)
    },
    updateAction: async (data: Map<any, any>, id: number) => {
      updateProject(data, id);
    },
    loadRelations: async (school_id: number) => {
      const schools = await getCustomData('schools','*',school_id);
      const programs = await getCustomData('programs','id_program, name',school_id);
      const mode = await getCustomData('modes');
      const students = await getCustomData('users', 'id_user, name', school_id,4);
      const professors = await getCustomData('users', 'id_user, name', school_id,3);
      return {
        schools:schools,
        programs: programs,
        mode: mode,
        students: students,
        professors: professors
      }
    }
  },

  usersManager:{
    schema: statusUserModalSchema,
    updateAction: async (status: number) => {
      updateUserStatus(status);
    },
    loadRelations: async () => {
      const estatus = await getCustomData("status_user")
      return {
        status: estatus
      }
    },
  },

  newPhase:{
    schema: phaseModalSchema,
    createAction: async (data: Map<any, any>) => {
      updatePhaseProject(data);
    },
    loadRelations: async (school_id: number) => {
      const phase = await getCustomData('phase');
      const works = await getCustomData('works','id_work, title',school_id);
      const students = await getCustomData('users', 'id_user, name', school_id,4);
      const professors = await getCustomData('users', 'id_user, name', school_id,3);
      return {
        phase: phase,
        works: works,
        students: students,
        professors: professors
      }
    }
  },

  datePhase:{
    schema: phaseProjectDateModalSchema,
    createAction: async (data: Map<any, any>) => {
      updatePhaseProjectDate(data);
    },
    loadRelations: async (school_id: number) => {
      const phase = await getCustomData('phase');
      const works = await getCustomData('works','id_work, title',school_id);
      return {
        phase: phase,
        works: works
      }
    }
  },

  studentAdvance: {
    schema: studentAdvanceModalSchema,
    createAction: async (formData: FormData) => {
      await insertDataStudent(formData);
    },
  },

  professorFeedback: {
    schema: professorFeedbackModalSchema,
    updateAction: async (formData: FormData) => {
      await updateDataProfessor(formData);
    },
  }
}
