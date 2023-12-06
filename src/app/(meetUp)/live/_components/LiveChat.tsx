'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from '../live.module.scss'
import ISupabase from '@/type/SupabaseResponse'
import { createChat, supabase } from '@/utils/apiRequest/commentsApiRequest'
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js'

const LiveChat = ({
  serverData,
  user,
}: {
  serverData: ISupabase[]
  user: ISupabase
}) => {
  const [chat, setChat] = useState<ISupabase[]>([...serverData])
  const inputValue = useRef()
  useEffect(() => {
    const getLive = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live',
        },
        (
          payload: RealtimePostgresInsertPayload<{
            [key: string]: any
          }>,
        ) => setChat([...chat, payload.new]),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(getLive)
    }
  }, [supabase, chat, setChat])

  const profiles = ['santa', 'snowman', 'candle', 'cookie']
  const videoID = 'qweqwe' // 추후에 pathQuery로 가져오기
  const handleCreate = async (e: any) => {
    if (e.key === 'Enter') {
      const res = await createChat(
        videoID,
        user.nick_name || '',
        user.user_id || '',
        user.profile_img,
        inputValue?.current?.value,
      )
      if (res) {
        setChat([...chat, res])
      }
      inputValue.current.value = ''
    }
  }
  return (
    <div className={styles.liveChatContainer}>
      <ul className={styles.liveChat}>
        {chat?.map((liveChat: ISupabase) => {
          return (
            <li key={liveChat.id} className={styles.liveChatBox}>
              <img
                src={`/assets/profile-${profiles[liveChat.profile_img]}.svg`}
                alt=""
              />
              <span className={styles.userName}> {liveChat.user_name}</span>
              <span> {liveChat.live_content}</span>
            </li>
          )
        })}
      </ul>
      <div className={styles.createChat}>
        <img src={`/assets/profile-${profiles[user.profile_img]}.svg`} alt="" />
        <input
          type="text"
          placeholder="하고싶은 말을 입력해보세요."
          ref={inputValue}
          onKeyPress={handleCreate}
        />
      </div>
    </div>
  )
}

export default LiveChat
