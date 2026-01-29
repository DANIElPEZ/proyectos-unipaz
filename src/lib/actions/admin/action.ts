'use server'

import { supabase } from '@/src/lib/actions/psql-connection'
import bcrypt from 'bcrypt';

export async function getData(table_name: string) {
     const { data, error } = await supabase.from(table_name).select('*');

     if (error) throw new Error(error.message);
     return data ?? []
}

export async function updateData(table_name: string, data: any, id: number, id_column: string) {
     if (table_name === 'users' && data.password) {
          data.password = await bcrypt.hash(data.password, 10);
     }
     const { error } = await supabase.from(table_name).update(data).eq(id_column, id);
     if (error) {
          throw new Error(error.message);
     }
}

export async function insertData(table_name: string, data: any) {
     if (table_name === 'users' && data.password) {
          data.password = await bcrypt.hash(data.password, 10);
     }
     const { error } = await supabase.from(table_name).insert(data);
     if (error) {
          throw new Error(error.message);
     }

}