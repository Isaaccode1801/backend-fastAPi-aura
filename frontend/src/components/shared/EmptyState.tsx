type EmptyStateProps = {
  children: React.ReactNode;
};

export function EmptyState({ children }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-coesi-muted-light/50 bg-white px-6 py-12 text-center">
      <p className="text-sm text-coesi-muted">{children}</p>
    </div>
  );
}
