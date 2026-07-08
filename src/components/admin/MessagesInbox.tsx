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

function initials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export default function MessagesInbox() {
    const [messages, setMessages] = useState<Message[]>([])
    const [selected, setSelected] = useState<Message | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => { fetchMessages() }, [])

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
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        })

    return (
        <div className={styles.wrap}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.iconWrap}>
                        <i className="ti ti-mail" />
                    </div>
                    <div>
                        <h1 className={styles.title}>Meddelanden</h1>
                        <p className={styles.sub}>Inkommande kundmeddelanden</p>
                    </div>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statPill}>
                        <span className={styles.statNum}>{messages.length}</span>
                        <span className={styles.statLabel}>Totalt</span>
                    </div>
                    {unreadCount > 0 && (
                        <div className={`${styles.statPill} ${styles.statPillUnread}`}>
                            <span className={styles.statNum}>{unreadCount}</span>
                            <span className={styles.statLabel}>Olästa</span>
                        </div>
                    )}
                    {unreadCount === 0 && messages.length > 0 && (
                        <div className={`${styles.statPill} ${styles.statPillDone}`}>
                            <i className="ti ti-check" />
                            <span className={styles.statLabel}>Allt läst</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.grid}>

                {/* ── Lista ── */}
                <div className={styles.list}>
                    {loading && (
                        <div className={styles.skeletonList}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={styles.skeletonItem}>
                                    <div className={styles.skeletonAvatar} />
                                    <div className={styles.skeletonLines}>
                                        <div className={styles.skeletonLine} style={{ width: '60%' }} />
                                        <div className={styles.skeletonLine} style={{ width: '85%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className={styles.emptyList}>
                            <div className={styles.emptyRing}>
                                <i className="ti ti-inbox" />
                            </div>
                            <p className={styles.emptyText}>Inga meddelanden än</p>
                            <p className={styles.emptyHint}>Kundmeddelanden från kontaktformuläret visas här</p>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`${styles.listItem} ${selected?.id === msg.id ? styles.active : ''} ${!msg.read ? styles.unread : ''}`}
                            onClick={() => handleSelect(msg)}
                        >
                            <div className={styles.listAvatar}>
                                {initials(msg.name)}
                            </div>
                            <div className={styles.listContent}>
                                <div className={styles.listTop}>
                                    <span className={styles.listName}>{msg.name}</span>
                                    <span className={styles.listDate}>{formatDate(msg.created_at)}</span>
                                </div>
                                <p className={styles.listEmail}>{msg.email}</p>
                                <p className={styles.listPreview}>
                                    {msg.message.slice(0, 55)}{msg.message.length > 55 ? '…' : ''}
                                </p>
                            </div>
                            {!msg.read && <span className={styles.unreadDot} />}
                        </div>
                    ))}
                </div>

                {/* ── Detalj ── */}
                <div className={styles.detail}>
                    {!selected ? (
                        <div className={styles.detailEmpty}>
                            <div className={styles.detailEmptyRing}>
                                <i className="ti ti-mail-opened" />
                            </div>
                            <p className={styles.detailEmptyText}>Välj ett meddelande</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.detailHeader}>
                                <div className={styles.detailSender}>
                                    <div className={styles.detailAvatar}>{initials(selected.name)}</div>
                                    <div>
                                        <h2 className={styles.detailName}>{selected.name}</h2>
                                        <p className={styles.detailMeta}>{formatDate(selected.created_at)}</p>
                                    </div>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteMessage(selected.id)}
                                    title="Radera meddelande"
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