import { AuthLayout } from './AuthLayout'
import type { ReactNode } from 'react'

export const GuruLayout = ({ children }: { children?: ReactNode }) => <AuthLayout role="guru">{children}</AuthLayout>
