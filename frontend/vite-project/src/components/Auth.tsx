import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../api'
import { buttonClass, inputClass } from './styles'
import { ErrorNotice } from './ui'

const authSchema = z.object({
  name: z.string().optional(),
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Use at least 6 characters'),
})

type AuthForm = z.infer<typeof authSchema>

type AuthProps = {
  signup?: boolean
  onAuthenticated: (token: string) => void
}

const labelClass = 'grid gap-2 text-[13px] font-semibold text-fg'

export function Auth({ signup = false, onAuthenticated }: AuthProps) {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<unknown>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const submit = async (form: AuthForm) => {
    try {
      setSubmitError(undefined)
      if (signup) {
        await api.signup({
          name: form.name?.trim() || 'Yada Yada user',
          email: form.email,
          password: form.password,
        })
        navigate('/login', { replace: true })
        return
      }

      const session = await api.login(form.email, form.password)
      onAuthenticated(session.access_token)
      navigate('/app', { replace: true })
    } catch (error) {
      setSubmitError(error)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <div className="w-full max-w-[430px] rounded-2xl border border-border bg-surface p-6 shadow-[0_24px_70px_rgba(41,37,36,0.08)] sm:p-[42px]">
        <div className="grid size-11 place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground" aria-hidden="true">Y</div>
        <p className="mb-2 mt-7 text-[11px] font-extrabold tracking-[0.18em] text-accent">YADA YADA</p>
        <h1 className="font-serif text-[34px] font-semibold leading-tight text-fg sm:text-[40px]">
          {signup ? 'Make space for your thoughts.' : 'Welcome back.'}
        </h1>
        <p className="mb-7 mt-3 max-w-[46ch] leading-relaxed text-muted">
          {signup
            ? 'Keep notes and checklists together without losing your train of thought.'
            : 'Pick up where you left off.'}
        </p>

        <form onSubmit={handleSubmit(submit)} className="grid gap-[18px]" noValidate>
          {signup && (
            <label htmlFor="name" className={labelClass}>
              Name
              <input id="name" className={inputClass} {...register('name')} autoComplete="name" placeholder="Your name" />
            </label>
          )}
          <label htmlFor="email" className={labelClass}>
            Email
            <input id="email" className={inputClass} {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
            {errors.email && <small id="email-error" className="text-danger">{String(errors.email.message)}</small>}
          </label>
          <label htmlFor="password" className={labelClass}>
            Password
            <input id="password" className={inputClass} type="password" {...register('password')} autoComplete={signup ? 'new-password' : 'current-password'} placeholder="••••••••" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />
            {errors.password && <small id="password-error" className="text-danger">{String(errors.password.message)}</small>}
          </label>
          {submitError !== undefined && <ErrorNotice error={submitError} />}
          <button className={buttonClass} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : signup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-muted">
          {signup ? 'Already have an account?' : 'New to Yada Yada?'}{' '}
          <Link className="font-semibold text-accent underline-offset-4 hover:underline" to={signup ? '/login' : '/signup'}>
            {signup ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </main>
  )
}
