'use server'

import { supabase } from '@/src/lib/actions/psql-connection'

export async function getCustomData(table_name: string, colums: string = '*', id_school?: number, role?: number) {
     let query = supabase.from(table_name).select(colums);
     if (id_school !== undefined) {
          query = query.eq('id_school', id_school);
     }

     if (role !== undefined) {
          query = query.eq('id_role', role);
     }
     const { data, error } = await query;
     if (error) throw new Error(error.message);
     return data ?? []
}

export async function updateUserStatus(data: any) {
     const { error } = await supabase.from('users').update({ id_status: data.id_status }).eq('id_user', data.id_user);
     if (error) {
          throw new Error(error.message);
     }
}

export async function createProject(setData: any) {
     const payload = {
          ...setData,
          id_program: Number(setData.id_program),
          id_school: Number(setData.id_school),
          id_mode: Number(setData.id_mode)
     };
     const { data, error } = await supabase.from('works').insert(payload).select();
     if (error) {
          throw new Error(error.message);
     }
     await supabase.from('phase_work').insert({ id_phase: 1, id_work: data[0].id_work, initial_date: setData.initial_date, id_students: data[0].id_students, id_professors: data[0].id_professors });
}

export async function updateProject(data: Map<any, any>, id: number) {
     const { error } = await supabase.from('works').update(data).eq('id_work', id);
     if (error) {
          throw new Error(error.message);
     }
}

export async function updatePhaseProjectDate(data: any) {
     console.log(data)
     const { error } = await supabase.from('phase_work').update({ end_date: data.end_date }).eq('id_work', data.id_work).eq('id_phase', data.id_phase);
     if (error) {
          throw new Error(error.message);
     }
}

export async function updatePhaseProject(data: any) {
     const payload = { ...data, id_work: Number(data.id_work), id_phase: Number(data.id_phase) }
     const { error } = await supabase.from('phase_work').insert(payload);
     if (error) {
          throw new Error(error.message);
     }
     await supabase.from('works').update({id_students:data.id_students,id_professors:data.id_professors}).eq('id_work', data.id_work);
}