interface Props {
    label: string;
    value?: string | number | null;
}

export function InfoField({ label, value }: Props) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-sm text-foreground">{value ?? '—'}</span>
        </div>
    );
}
