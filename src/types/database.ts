export type SubscriptionStatus = 'pending' | 'authorized' | 'paused' | 'cancelled'
export type PaymentStatus = 'processed' | 'in_process' | 'rejected' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string
          nombre: string
          apellido: string
          email: string
          telefono: string
          plan: string
          monto: number
          preapproval_id: string
          status: SubscriptionStatus
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          email: string
          telefono: string
          plan: string
          monto: number
          preapproval_id: string
          status?: SubscriptionStatus
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          email?: string
          telefono?: string
          plan?: string
          monto?: number
          preapproval_id?: string
          status?: SubscriptionStatus
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          subscription_id: string
          mp_payment_id: string
          amount: number
          status: PaymentStatus
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          mp_payment_id: string
          amount: number
          status: PaymentStatus
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          mp_payment_id?: string
          amount?: number
          status?: PaymentStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_subscription_id_fkey'
            columns: ['subscription_id']
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          }
        ]
      }
      receipts: {
        Row: {
          id: string
          subscription_id: string | null
          telefono: string
          file_url: string
          matched: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id?: string | null
          telefono: string
          file_url: string
          matched?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string | null
          telefono?: string
          file_url?: string
          matched?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'receipts_subscription_id_fkey'
            columns: ['subscription_id']
            referencedRelation: 'subscriptions'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
