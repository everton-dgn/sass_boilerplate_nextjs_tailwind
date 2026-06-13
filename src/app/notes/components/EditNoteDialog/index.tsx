import { useEffect } from 'react'

import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/molecules/Dialog'

import { zodResolver } from '@hookform/resolvers/zod'
import { Root as Dialog } from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'

import { useUpdateNote } from '../../services/mutations/useUpdateNote'
import { type UpdateNoteInput, updateNoteSchema } from '../../services/types'

import type { EditNoteDialogProps } from './types'

export const EditNoteDialog = ({ note, onClose }: EditNoteDialogProps) => {
  const updateNote = useUpdateNote()
  const form = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: { title: '', content: '' }
  })

  useEffect(() => {
    if (note) {
      form.reset({ title: note.title, content: note.content })
    }
  }, [note, form])

  const onSubmit = (values: UpdateNoteInput) => {
    if (!note) return
    onClose()
    updateNote.mutate({ id: note.id, ...values })
  }

  return (
    <Dialog open={!!note} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nota</DialogTitle>
          <DialogDescription>
            Atualize o título e o conteúdo da nota selecionada.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Título"
              variant={form.formState.errors.title ? 'destructive' : 'default'}
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Conteúdo"
              variant={
                form.formState.errors.content ? 'destructive' : 'default'
              }
              {...form.register('content')}
            />
            {form.formState.errors.content && (
              <p className="text-destructive text-sm">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
