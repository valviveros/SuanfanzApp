import { MessageI } from './MessageI';

export interface GroupI{
    owner?: string
    integrants: string[]
    name: string
    title: string
    icon: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
}