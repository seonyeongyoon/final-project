import axios, { AxiosResponse } from 'axios'

const printErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message)
  }
}

const youtubeApiRequest = async <T>(optionalQuery: {
  [info: string]: string
}): Promise<AxiosResponse<T>> => {
  try {
    const URL = process.env.YOUTUBE_API_URL as string
    const youtubeApiData = await axios.get(URL, {
      params: {
        q: '크리스마스|크리스마스영화',
        part: 'snippet',
        regionCode: 'kr',
        type: 'video',
        maxResults: '8',
        ...optionalQuery,
        key: process.env.YOUTUBE_API_KEY,
      },
    })
    return youtubeApiData.data
  } catch (error) {
    printErrorMessage(error)
    throw new Error('[ERROR] Youtube API 요청 불가. JSON 데이터로 대체합니다.')
  }
}

const youtubeJsonRequest = async <T>({
  apiType,
  optionalQuery,
}: {
  apiType: string
  optionalQuery: { [info: string]: string }
}): Promise<T> => {
  try {
    let jsonData
    if (apiType === 'popular' || apiType === 'search') {
      jsonData = await import(
        `@public/videos/christmas/christmasPopular_v1.json`
      )
    } else {
      const { channelId } = optionalQuery
      jsonData = await import(
        `@public/videos/christmas/searchByChannels/search-by-channel-id-${channelId}.json`
      )
    }

    return jsonData.default
  } catch (error) {
    printErrorMessage(error)
    throw new Error('[ERROR] 유효하지 않은 JSON 데이터 요청입니다.')
  }
}

const youtubeDataRequest = async <T>({
  apiType,
  optionalQuery = {},
}: {
  apiType: string
  optionalQuery?: { [info: string]: string }
}): Promise<T> => {
  let youtubeData
  try {
    youtubeData = await youtubeApiRequest<T>(optionalQuery)
  } catch (error) {
    printErrorMessage(error)
    youtubeData = await youtubeJsonRequest<T>({ apiType, optionalQuery })
  }

  return youtubeData as T
}

export default youtubeDataRequest
