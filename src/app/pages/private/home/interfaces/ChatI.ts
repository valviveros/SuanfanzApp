import { MessageI } from './MessageI';

export interface ChatI{
    title: string
    icon: string
    status: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
}
