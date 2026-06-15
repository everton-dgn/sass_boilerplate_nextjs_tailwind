# UI components

Convenções para componentes de interface compartilhados.

---

## Componentes de formulário (Input, Textarea)

Padrão com `tailwind-variants` e prop `variant`:

```tsx
const inputVariants = tv({
  base: ['flex h-9 w-full rounded-md border px-3 py-1', ...],
  variants: {
    variant: {
      default: 'border-input',
      destructive:
        'border-destructive focus-visible:ring-destructive/50'
    }
  },
  defaultVariants: { variant: 'default' }
})

export const Input = forwardRef<
  HTMLInputElement,
  InputProps & VariantProps<typeof inputVariants>
>(({ className, variant, ...props }, ref) => (
  <input
    className={inputVariants({ variant, className })}
    ref={ref}
    {...props}
  />
))
```

- **`variant="destructive"`** para estado de erro em formulários.
- Usa `forwardRef` para compatibilidade com React Hook Form `register()`.
- Tipo = `InputProps & VariantProps<typeof inputVariants>`.

---

## Dialog (molecule)

Dialog baseado em Radix UI primitives (`@radix-ui/react-dialog`):

```
src/components/molecules/Dialog/
├── index.tsx           # DialogContent, DialogHeader, DialogFooter,
│                       # DialogTitle, DialogDescription
└── types.ts
```

- Exporta **sub-componentes compostos** (não o Root — consumidor importa
  `Root as Dialog` do Radix diretamente).
- `DialogContent` inclui overlay + portal + botão de fechar automático.
- Animations via `data-[state=open/closed]` + Tailwind animate classes.

### Uso em features

```tsx
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/molecules/Dialog'
import { Root as Dialog } from '@radix-ui/react-dialog'

<Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar item</DialogTitle>
    </DialogHeader>
    <form>...</form>
    <DialogFooter>...</DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Topbar — links de navegação

Links configurados em `constants.ts`:

```tsx
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Início' }
]
```

- Ao adicionar nova rota, basta incluir no array `NAV_LINKS`.
- Topbar renderiza links com destaque visual para rota ativa (`pathname`).
