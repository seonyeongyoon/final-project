import { createClient } from '@supabase/supabase-js'
import ISurvey from '@/type/SupabaseResponse'

export const supabase = createClient<ISupabase[]>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
)

export const getSurveyResult = async (id):ISurvey => {
  try {
    const { data, error } = await supabase.from('survey').select('*')
    if (error) throw new Error('error')
    console.log(data)

    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}



// export const insertSurveyValue = async () => {
// const { data, error } = await supabase
//   .from('survey')
//   .insert([
//     { firsty_baby: 3, first_adult: 4 },
//   ])
//   .select()
        
// }



// const { data, error } = await surveyReult
// if (error) throw error
// const surveyReult: ISurvey = data