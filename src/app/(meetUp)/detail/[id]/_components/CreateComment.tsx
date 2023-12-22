'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {  } from '@/utils/apiRequest/commentsApiRequest'
import { supabase } from '@/utils/apiRequest/defaultApiSetting'

const CreateComment = ({
  profile,
  fetchComments,
}: {
  profile: number
  fetchComments: () => Promise<void>
}) => {
  const pathParam: string = usePathname()
  const paramArr: string[] = pathParam.split('/')
  const videoId: string = paramArr[paramArr.length - 1]
  const inputValue = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState<string | undefined>('')

  const getUserName = async (): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUserName(user?.user_metadata.user_name)
  }

  const handleCreateCommnet = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      if (inputValue?.current?.value) {
        await createComments(
          inputValue.current.value,
          videoId,
          userName,
          profile,
        )
        inputValue.current.value = ''
        fetchComments()
      }
    }
  }

  useEffect(() => {
    getUserName()
  }, [])

  return (
    <>
      <input
        ref={inputValue}
        type="text"
        placeholder="댓글을 남겨주세요"
        onKeyDown={e => handleCreateCommnet(e)}
      />
    </>
  )
}
export default CreateComment
