import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateNote } from '../../services/mutations/useCreateNote'
import { type CreateNoteInput, createNoteSchema } from '../../services/types'

export const useCreateNoteForm = () => {
  const [formKey, setFormKey] = useState(0)
  const createNote = useCreateNote()

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' }
  })

  const onSubmit = (values: CreateNoteInput) => {
    createNote.mutate(values, {
      onSuccess: () => {
        form.reset()
        setFormKey(prev => prev + 1)
      }
    })
  }

  return { form, formKey, isPending: createNote.isPending, onSubmit }
}
