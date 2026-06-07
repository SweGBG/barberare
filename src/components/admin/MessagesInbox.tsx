'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './MessagesInbox.module.css'

type Message = {
    id: string
    name: string
    email: string
    phone: string | null
    message: string
    read: boolean
    created_at: string
}

export default function MessagesInbox() {
    const [messages, setMessages] = useState<Message[]>([])
    const [selected, setSelected] = useState<Message | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
        setMessages(data ?? [])
        setLoading(false)
    }

    const markAsRead = async (id: string) => {
        await supabase.from('messages').update({ read: true }).eq('id', id)
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    }

    const deleteMessage = async (id: string) => {
        await supabase.from('messages').delete().eq('id', id)
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selected?.id === id) setSelected(null)
    }

    const handleSelect = (msg: Message) => {
        setSelected(msg)
        if (!msg.read) markAsRead(msg.id)
    }

    const unreadCount = messages.filter(m => !m.read).length

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('sv-SE', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Meddelanden</h1>
                    <p className={styles.sub}>{messages.length} totalt · {unreadCount} olästa</p>
                </div>
            </div>

            <div className={styles.grid}>

                {/* LISTA */}
                <div className={styles.list}>
                    {loading && <p className={styles.empty}>Laddar...</p>}
                    {!loading && messages.length === 0 && (
                        <p className={styles.empty}>Inga meddelanden än.</p>
                    )}
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`${styles.listItem} ${selected?.id === msg.id ? styles.active : ''} ${!msg.read ? styles.unread : ''}`}
                            onClick={() => handleSelect(msg)}
                        >
                            <div className={styles.listTop}>
                                <span className={styles.listName}>{msg.name}</span>
                                <span className={styles.listDate}>{formatDate(msg.created_at)}</span>
                            </div>
                            <p className={styles.listEmail}>{msg.email}</p>
                            <p className={styles.listPreview}>{msg.message.slice(0, 60)}...</p>
                            {!msg.read && <span className={styles.unreadDot} />}
                        </div>
                    ))}
                </div>

                {/* DETALJ */}
                <div className={styles.detail}>
                    {!selected ? (
                        <div className={styles.detailEmpty}>
                            <i className="ti ti-mail" />
                            <p>Välj ett meddelande</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.detailHeader}>
                                <div>
                                    <h2 className={styles.detailName}>{selected.name}</h2>
                                    <p className={styles.detailMeta}>{formatDate(selected.created_at)}</p>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteMessage(selected.id)}
                                >
                                    <i className="ti ti-trash" />
                                </button>
                            </div>

                            <div className={styles.detailInfo}>
                                <a href={`mailto:${selected.email}`} className={styles.detailLink}>
                                    <i className="ti ti-mail" /> {selected.email}
                                </a>
                                {selected.phone && (
                                    <a href={`tel:${selected.phone}`} className={styles.detailLink}>
                                        <i className="ti ti-phone" /> {selected.phone}
                                    </a>
                                )}
                            </div>

                            <div className={styles.detailBody}>
                                <p>{selected.message}</p>
                            </div>

                            <a
                                href={`mailto:${selected.email}?subject=Svar%20fr%C3%A5n%20Atilli%20Berg`}
                                className={styles.replyBtn}
                            >
                                <i className="ti ti-send" /> Svara via e-post
                            </a>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}