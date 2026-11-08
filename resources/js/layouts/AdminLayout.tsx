import { AuthLayout } from './AuthLayout'
import type { ReactNode } from 'react'

export const AdminLayout = ({ children }: { children?: ReactNode }) => <AuthLayout role="admin">{children}</AuthLayout>
