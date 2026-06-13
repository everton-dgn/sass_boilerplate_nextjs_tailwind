const SkeletonForm = () => (
  <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-card p-6">
    <div className="h-9 w-full rounded-md bg-muted" />
    <div className="h-20 w-full rounded-md bg-muted" />
    <div className="flex justify-end">
      <div className="h-9 w-24 rounded-md bg-muted" />
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-card p-6">
    <div className="flex items-center justify-between">
      <div className="h-5 w-2/3 rounded bg-muted" />
      <div className="flex gap-1">
        <div className="size-9 rounded bg-muted" />
        <div className="size-9 rounded bg-muted" />
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="h-3.5 w-full rounded bg-muted" />
      <div className="h-3.5 w-4/5 rounded bg-muted" />
    </div>
    <div className="h-3 w-20 rounded bg-muted" />
  </div>
)

const SKELETON_COUNT = 3

const NotesLoading = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-24 pb-12">
    <header>
      <div className="h-7 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
    </header>
    <SkeletonForm />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
)

export default NotesLoading
