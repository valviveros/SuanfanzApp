import { MessageI } from './MessageI';

export interface ChatI{
    email: string
    title: string
    icon: string
    status?: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
}
