import axios from 'axios'

const youtubeApiRequest = async (
  apiType: string = 'videos',
  optionalQuery: string = '&chart=mostPopular',
  maxResults: number = 32,
) => {
  const ACCESS_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  const BASIC_URL = `https://youtube.googleapis.com/youtube/v3/${apiType}?part=snippet&regionCode=kr`
  const URL = `${BASIC_URL}${optionalQuery}&maxResults=${maxResults}&key=${ACCESS_KEY}`
  let response
  try {
    response = await axios.get(URL)
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  if (!response) {
    throw new Error('data is not defined')
  }

  return response.data.items
}

export default youtubeApiRequest
